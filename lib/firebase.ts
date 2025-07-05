// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkuA5_cNtj6yBLkmP5J0E1wgYbFD7FiWk",
  authDomain: "link-app-62f6f.firebaseapp.com",
  projectId: "link-app-62f6f",
  storageBucket: "link-app-62f6f.firebasestorage.app",
  messagingSenderId: "54534869924",
  appId: "1:54534869924:web:7028d1201085fbd93d6731",
  measurementId: "G-RMZ24N709B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);