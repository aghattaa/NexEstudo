import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXqpR2VeQRYghwfPiSVbb01LHpEUzITH8",
  authDomain: "nexestudo-b0e0a.firebaseapp.com",
  projectId: "nexestudo-b0e0a",
  storageBucket: "nexestudo-b0e0a.firebasestorage.app",
  messagingSenderId: "462342649252",
  appId: "1:462342649252:web:42ec410d5b209279173d31",
  measurementId: "G-KE0KDMRKL0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
