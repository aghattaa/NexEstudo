import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDS--A9g8iIKEYzVmRukKmu0N4hjjAb6pY",
  authDomain: "nexestudo.firebaseapp.com",
  projectId: "nexestudo",
  storageBucket: "nexestudo.firebasestorage.app",
  messagingSenderId: "694933765606",
  appId: "1:694933765606:web:74dae54d5c773796bd6a27",
  measurementId: "G-G22BJ8Q0KK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
