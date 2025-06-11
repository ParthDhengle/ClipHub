import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF8kwV7ijmynzjAeZ_kBdBS6YxOnWVNiQ",
  authDomain: "cliphub-d93f6.firebaseapp.com",
  projectId: "cliphub-d93f6",
  storageBucket: "cliphub-d93f6.firebasestorage.app",
  messagingSenderId: "996722298732",
  appId: "1:996722298732:web:d12abfc38323f933c82d49"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)