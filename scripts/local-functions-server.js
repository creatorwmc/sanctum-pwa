import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '..', 'service-account.json'), 'utf8')
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const app = express();
app.use(cors());
app.use(express.json());

// Reset password endpoint
app.post('/.netlify/functions/reset-password', async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email || !answer || !newPassword) {
      return res.status(400).json({ error: 'Email, answer, and new password are required' });
    }

    // Find user by email
    const userRecord = await admin.auth().getUserByEmail(email.toLowerCase());

    // Get security answer from Firestore
    const securityDoc = await db.collection('securityAnswers').doc(userRecord.uid).get();

    if (!securityDoc.exists) {
      return res.status(404).json({ error: 'No security question found for this account' });
    }

    const storedAnswer = securityDoc.data().answer;

    // Verify the answer
    if (storedAnswer !== answer.toLowerCase()) {
      return res.status(401).json({ error: 'Incorrect security answer' });
    }

    // Update the password
    await admin.auth().updateUser(userRecord.uid, {
      password: newPassword,
    });

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset error:', error);

    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    return res.status(500).json({ error: 'Password reset failed. Please try again.' });
  }
});

const PORT = 3003; // sanctum
app.listen(PORT, () => {
  console.log(`Local functions server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /.netlify/functions/reset-password');
});
