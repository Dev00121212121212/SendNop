const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');

// Replace with the path to your service account key file
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST endpoint to send notification
app.post('/sendNotification', async (req, res) => {
  const { title, body, token } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
    token: token
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ message: 'Notification sent', response });
  } catch (error) {
    res.status(500).json({ message: 'Error sending notification', error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FCM server running at http://localhost:${PORT}`);
});
