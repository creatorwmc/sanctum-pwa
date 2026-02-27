const admin = require('firebase-admin');

// --- CORS origin validation ---
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
const DEFAULT_ORIGIN = 'https://sanctum-pwa.netlify.app';

function getCorsHeaders(event) {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : DEFAULT_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// --- In-memory rate limiting ---
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // max 5 attempts per IP per window

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  return false;
}

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  const cors = getCorsHeaders(event);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Rate limiting by client IP
  const clientIp = event.headers?.['x-forwarded-for']?.split(',')[0]?.trim()
    || event.headers?.['client-ip']
    || 'unknown';
  if (isRateLimited(clientIp)) {
    return {
      statusCode: 429,
      headers: { ...cors, 'Content-Type': 'application/json', 'Retry-After': '900' },
      body: JSON.stringify({ error: 'Too many password reset attempts. Please try again later.' })
    };
  }

  try {
    const { email, securityAnswer, newPassword } = JSON.parse(event.body);

    // Validate input
    if (!email || !securityAnswer || !newPassword) {
      return {
        statusCode: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Email, security answer, and new password are required' })
      };
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return {
        statusCode: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Password must be at least 8 characters' })
      };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedAnswer = securityAnswer.toLowerCase().trim();

    // Look up the security answer
    const docRef = db.collection('securityAnswers').doc(normalizedEmail);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return {
        statusCode: 404,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No security answer found for this email' })
      };
    }

    const storedData = docSnap.data();

    // Verify the answer matches
    if (storedData.answer !== normalizedAnswer) {
      return {
        statusCode: 403,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Incorrect security answer' })
      };
    }

    // Get the user by email
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(normalizedEmail);
    } catch (authError) {
      if (authError.code === 'auth/user-not-found') {
        return {
          statusCode: 404,
          headers: { ...cors, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'No account found with this email' })
        };
      }
      throw authError;
    }

    // Update the password using Admin SDK
    await admin.auth().updateUser(userRecord.uid, {
      password: newPassword
    });

    // Log the reset (optional)
    await db.collection('passwordResetLogs').add({
      email: normalizedEmail,
      resetAt: admin.firestore.FieldValue.serverTimestamp(),
      success: true
    });

    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Password updated successfully' })
    };

  } catch (error) {
    console.error('Password reset error:', error);
    return {
      statusCode: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to reset password. Please try again.' })
    };
  }
};
