import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Get environment variables directly
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('Missing Firebase configuration for:', missingFields.join(', '));
  console.error('Current config:', firebaseConfig);
  
  if (process.env.NODE_ENV === 'development') {
    console.warn('Firebase initialization may fail due to missing configuration. Please check .env.local.');
  } else {
    throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
  }
}

// Debug logging (remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase config loaded:', {
    apiKey: firebaseConfig.apiKey ? '✓' : '✗',
    authDomain: firebaseConfig.authDomain ? '✓' : '✗',
    projectId: firebaseConfig.projectId ? '✓' : '✗',
    storageBucket: firebaseConfig.storageBucket ? '✓' : '✗',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✓' : '✗',
    appId: firebaseConfig.appId ? '✓' : '✗',
  });
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };