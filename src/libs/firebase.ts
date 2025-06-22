import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_APIKEY',
  'VITE_FIREBASE_AUTHDOMAIN',
  'VITE_FIREBASE_PROJECTID',
  'VITE_FIREBASE_STORAGEBUCKET',
  'VITE_FIREBASE_MESSAGINGSENDERID',
  'VITE_FIREBASE_APPID',
];

const missingVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
if (missingVars.length > 0) {
  throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`);
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

export const storage = getStorage(firebaseApp);
export const db = getFirestore(firebaseApp);
