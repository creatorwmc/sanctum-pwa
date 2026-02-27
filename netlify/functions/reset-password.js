import admin from 'firebase-admin';

// --- CORS origin validation ---
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
const DEFAULT_ORIGIN = 'https://practicespace.netlify.app';

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

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  console.log('Initializing Firebase Admin with project:', projectId);

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: projectId,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    projectId: projectId,
  });
}

const db = admin.firestore();
// Explicitly set to use the default database
db.settings({ ignoreUndefinedProperties: true });

export const handler = async (event) => {
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
      body: JSON.stringify({ error: 'Method not allowed' }),
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
      body: JSON.stringify({ error: 'Too many password reset attempts. Please try again later.' }),
    };
  }

  try {
    const { email, answer, newPassword } = JSON.parse(event.body);

    if (!email || !answer || !newPassword) {
      return {
        statusCode: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Email, answer, and new password are required' }),
      };
    }

    // Find user by email
    const userRecord = await admin.auth().getUserByEmail(email.toLowerCase());

    // Get security answer from Firestore (stored by email, not UID)
    const normalizedEmail = email.toLowerCase().trim();
    const securityDoc = await db.collection('securityAnswers').doc(normalizedEmail).get();

    if (!securityDoc.exists) {
      return {
        statusCode: 404,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No security question found for this account' }),
      };
    }

    const storedAnswer = securityDoc.data().answer;

    // Verify the answer
    if (storedAnswer !== answer.toLowerCase()) {
      return {
        statusCode: 401,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Incorrect security answer' }),
      };
    }

    // Update the password
    await admin.auth().updateUser(userRecord.uid, {
      password: newPassword,
    });

    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Password updated successfully' }),
    };
  } catch (error) {
    console.error('Password reset error:', error);

    if (error.code === 'auth/user-not-found') {
      return {
        statusCode: 404,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No account found with this email' }),
      };
    }

    return {
      statusCode: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Password reset failed. Please try again.' }),
    };
  }
};
