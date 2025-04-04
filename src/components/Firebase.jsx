// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics} from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "feelm-app.firebaseapp.com",
  projectId: "feelm-app",
  storageBucket: "feelm-app.appspot.com",
  messagingSenderId: "234501643496",
  appId: "1:234501643496:web:3f9cac860e44d72352bd5d",
  measurementId: "G-F8YT22CXWD"
};

const app = initializeApp(firebaseConfig);
export const auth =getAuth();
export const db =getFirestore(app);
export const storage=getStorage();

export default app;