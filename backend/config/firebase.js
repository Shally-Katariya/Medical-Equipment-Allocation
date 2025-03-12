const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // Ensure correct path

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "medical-equipment-alloca-b22ed.firebaseapp.com", // Replace with your Firestore database URL
});

const db = admin.firestore();
console.log("🔥 Firestore Initialized");
module.exports = { db };
