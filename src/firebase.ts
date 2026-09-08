import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup,
  ConfirmationResult,
  signOut
} from 'firebase/auth';

// Standard Firebase Client Config (supports environment variables or local developer settings)
const getCustomConfig = () => {
  try {
    const saved = localStorage.getItem('meridian_firebase_config');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignore
  }
  return null;
};

const customConfig = getCustomConfig();

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: customConfig?.apiKey || metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyCxm-LQvnDzb5gvuBbg78GnAkkV2t5FtXc",
  authDomain: customConfig?.authDomain || metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "studio-5679404862-2696a.firebaseapp.com",
  projectId: customConfig?.projectId || metaEnv.VITE_FIREBASE_PROJECT_ID || "studio-5679404862-2696a",
  storageBucket: customConfig?.storageBucket || metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "studio-5679404862-2696a.firebasestorage.app",
  messagingSenderId: customConfig?.messagingSenderId || metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "127546244814",
  appId: customConfig?.appId || metaEnv.VITE_FIREBASE_APP_ID || "1:127546244814:web:7cdaeb3a06a77e620d5a9f"
};

// Initialize Firebase safely (avoid re-initialization in HMR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const isRealFirebaseConfigured = () => {
  const key = firebaseConfig.apiKey;
  return Boolean(key && key.trim().length > 20 && !key.includes('DummyKey'));
};

export { 
  app, 
  auth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  googleProvider, 
  signInWithPopup, 
  signOut,
  type ConfirmationResult 
};

