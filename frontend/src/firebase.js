// Configuration Firebase côté frontend
// Remplace les valeurs par celles de ton projet Firebase
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Prefer .env variables, but fall back to your current Firebase config
// (this avoids a blank page if .env is missing or Vite wasn't restarted yet).
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ??
    "AIzaSyDzAwi228ARmgZ-cbZkf3CZWCN6xfcvCVc",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ??
    "law1-a7212.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "law1-a7212",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
    "law1-a7212.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "381882881251",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ??
    "1:381882881251:web:f9d54e02f66bfbc5ea61d6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};

