import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "feelm-app.firebaseapp.com",
  projectId: "feelm-app",
  storageBucket: "feelm-app.appspot.com",
  messagingSenderId: "234501643496",
  appId: "1:234501643496:web:3f9cac860e44d72352bd5d",
  measurementId: "G-F8YT22CXWD"
};

export const app = initializeApp(firebaseConfig);