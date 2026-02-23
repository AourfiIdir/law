import admin from "firebase-admin";
import "dotenv/config";
import fs from "node:fs";

let app;

export function getFirebaseAdmin() {
  if (!app) {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    let serviceAccount;
    try {
      if (serviceAccountPath) {
        const raw = fs.readFileSync(serviceAccountPath, "utf8");
        serviceAccount = JSON.parse(raw);
      } else if (serviceAccountJson) {
        // If you store it in .env, it MUST be a single-line JSON string.
        serviceAccount = JSON.parse(serviceAccountJson);
      } else {
        throw new Error(
          "Set FIREBASE_SERVICE_ACCOUNT_PATH (recommended) or FIREBASE_SERVICE_ACCOUNT (single-line JSON)."
        );
      }
    } catch (err) {
      throw new Error("Firebase service account is invalid: " + err.message);
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

