const admin = require('firebase-admin');

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
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, securityAnswer, newPassword } = JSON.parse(event.body);

    // Validate input
    if (!email || !securityAnswer || !newPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email, security answer, and new password are required' })
      };
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return {
        statusCode: 400,
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
        body: JSON.stringify({ error: 'No security answer found for this email' })
      };
    }

    const storedData = docSnap.data();

    // Verify the answer matches
    if (storedData.answer !== normalizedAnswer) {
      return {
        statusCode: 403,
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
      body: JSON.stringify({ success: true, message: 'Password updated successfully' })
    };

  } catch (error) {
    console.error('Password reset error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to reset password. Please try again.' })
    };
  }
};
