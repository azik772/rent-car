// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBX9RFwGepQXdRFAM24InYWxHGgc476GCs",
  authDomain: "rentcar-a2ec8.firebaseapp.com",
  databaseURL: "https://rentcar-a2ec8-default-rtdb.firebaseio.com",
  projectId: "rentcar-a2ec8",
  storageBucket: "rentcar-a2ec8.firebasestorage.app",
  messagingSenderId: "635765357147",
  appId: "1:635765357147:web:6e3c188e44331d5c009d7e",
  measurementId: "G-FCGDLRZCKY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const google = new GoogleAuthProvider();
export const rtdb = getDatabase(app);
