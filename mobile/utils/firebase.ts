import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rawApiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const isConfigured = !!rawApiKey && rawApiKey !== 'your-api-key' && rawApiKey.trim() !== '';

const firebaseConfig = {
  apiKey: isConfigured ? rawApiKey : 'mock-api-key-to-prevent-startup-crash',
  authDomain: (isConfigured ? process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN : '') || 'mock-auth-domain',
  projectId: (isConfigured ? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID : '') || 'mock-project-id',
  storageBucket: (isConfigured ? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET : '') || 'mock-storage-bucket',
  messagingSenderId: (isConfigured ? process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : '') || 'mock-sender-id',
  appId: (isConfigured ? process.env.EXPO_PUBLIC_FIREBASE_APP_ID : '') || 'mock-app-id',
};

if (!isConfigured) {
  console.warn(
    'Firebase environment variables are missing! The app is running in Local Mock mode. Please add your credentials in the `.env` file to sync with Firestore.'
  );
}

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with React Native persistence (AsyncStorage)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db, isConfigured };
