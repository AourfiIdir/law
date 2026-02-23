import admin from "firebase-admin";
import "dotenv/config";

let app;

export function getFirebaseAdmin() {
  if (!app) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountJson) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT env var is not set. Put your Firebase service account JSON here."
      );
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (err) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT must be valid JSON: " + err.message);
    }

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  return app;
}

export function getFirebaseAuth() {
  return getFirebaseAdmin().auth();
}

