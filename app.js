const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load service account from base64 env var
const serviceAccount = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString('utf8')
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Optional test route
app.get('/', (req, res) => {
  res.send('FCM Server is Running ✅');
});

// POST endpoint to send notification
app.post('/sendNotification', async (req, res) => {
  const { title, body, token } = req.body;

  const message = {
    notification: { title, body },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ message: 'Notification sent', response });
  } catch (error) {
    res.status(500).json({ message: 'Error sending notification', error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FCM server running at http://localhost:${PORT}`);
});
