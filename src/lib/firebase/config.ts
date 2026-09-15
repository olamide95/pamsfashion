import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

if (!isConfigured) {
  // Warn loudly rather than silently producing confusing downstream
  // auth/firestore errors. This fires both in local dev and during
  // `next build` (e.g. a fresh checkout before .env.local is filled in,
  // or a build pipeline that hasn't set env vars yet) — in every case the
  // fix is the same: copy .env.local.example and fill in real values.
  console.warn(
    "[firebase] Missing NEXT_PUBLIC_FIREBASE_* environment variables. " +
      "Copy .env.local.example to .env.local and fill in your Firebase project config. " +
      "Using placeholder values so the app can still build — Firebase calls will fail " +
      "at runtime until real config is provided."
  );
}

// Falls back to syntactically-valid placeholders when unconfigured, purely
// so `getAuth()`/`initializeApp()` don't throw synchronously at import time
// (which would otherwise crash `next build` — including static pages like
// /sitemap.xml — for anyone building before setting up .env.local). Actual
// Firebase calls still fail clearly at runtime until real config is set.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder-api-key-000000000000000",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "placeholder-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
};

// Guard against re-initialization during Next.js hot-reload / multiple imports.
function createFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApps()[0];
  return initializeApp(firebaseConfig);
}

export const firebaseApp: FirebaseApp = createFirebaseApp();
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
export const storage: FirebaseStorage = getStorage(firebaseApp);
