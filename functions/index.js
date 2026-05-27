const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function to reset password after security answer verification
 * Called from the client after verifying the security answer
 */
exports.resetPassword = functions.https.onCall(async (data, context) => {
  const { email, securityAnswer, newPassword } = data;

  // Validate input
  if (!email || !securityAnswer || !newPassword) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Email, security answer, and new password are required'
    );
  }

  // Validate password strength
  if (newPassword.length < 8) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password must be at least 8 characters'
    );
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedAnswer = securityAnswer.toLowerCase().trim();

  try {
    // Look up the security answer
    const docRef = db.collection('securityAnswers').doc(normalizedEmail);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'No security answer found for this email'
      );
    }

    const storedData = docSnap.data();

    // Verify the answer matches
    if (storedData.answer !== normalizedAnswer) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Incorrect security answer'
      );
    }

    // Get the user by email
    const userRecord = await admin.auth().getUserByEmail(normalizedEmail);

    // Update the password using Admin SDK
    await admin.auth().updateUser(userRecord.uid, {
      password: newPassword
    });

    // Log the reset (optional - for audit purposes)
    await db.collection('passwordResetLogs').add({
      email: normalizedEmail,
      resetAt: admin.firestore.FieldValue.serverTimestamp(),
      success: true
    });

    return { success: true, message: 'Password updated successfully' };

  } catch (error) {
    console.error('Password reset error:', error);

    // Re-throw HttpsErrors as-is
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    // Handle specific Firebase Auth errors
    if (error.code === 'auth/user-not-found') {
      throw new functions.https.HttpsError(
        'not-found',
        'No account found with this email'
      );
    }

    throw new functions.https.HttpsError(
      'internal',
      'Failed to reset password. Please try again.'
    );
  }
});
