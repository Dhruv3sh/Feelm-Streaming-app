// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics} from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsD7j5TfeUyiTkDWo330GJrKuFeoB8TCA",
  authDomain: "feelm-app.firebaseapp.com",
  projectId: "feelm-app",
  storageBucket: "feelm-app.appspot.com",
  messagingSenderId: "234501643496",
  appId: "1:234501643496:web:3f9cac860e44d72352bd5d",
  measurementId: "G-F8YT22CXWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth =getAuth();
export const db =getFirestore(app);

export default app;