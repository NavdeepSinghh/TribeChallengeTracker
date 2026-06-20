import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCu0O0Zo8omI9af_ZFYgGU7XMCzv5SEOT8",
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "tribechallengetracker.firebaseapp.com",
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID || "tribechallengetracker",
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "tribechallengetracker.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1045104267271",
  appId:             process.env.REACT_APP_FIREBASE_APP_ID || "1:1045104267271:web:0460d2ff12c04a37f61aa2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();
