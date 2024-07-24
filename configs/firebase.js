// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2-bDjGDyoGtm6tM7zUjh0u3mjH0MQfl8",
  authDomain: "foody-app-411ab.firebaseapp.com",
  projectId: "foody-app-411ab",
  storageBucket: "foody-app-411ab.appspot.com",
  messagingSenderId: "43131862582",
  appId: "1:43131862582:web:2bd937fae696bd22946297"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const fileStorage = getStorage(app);
