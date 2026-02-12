import admin from 'firebase-admin';

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
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, answer, newPassword } = JSON.parse(event.body);

    if (!email || !answer || !newPassword) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No security question found for this account' }),
      };
    }

    const storedAnswer = securityDoc.data().answer;

    // Verify the answer
    if (storedAnswer !== answer.toLowerCase()) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Incorrect security answer' }),
      };
    }

    // Update the password
    await admin.auth().updateUser(userRecord.uid, {
      password: newPassword,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Password updated successfully' }),
    };
  } catch (error) {
    console.error('Password reset error:', error);

    if (error.code === 'auth/user-not-found') {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No account found with this email' }),
      };
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Password reset failed. Please try again.' }),
    };
  }
};
