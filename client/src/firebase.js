// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-d7cca.firebaseapp.com",
  projectId: "real-estate-d7cca",
  storageBucket: "real-estate-d7cca.appspot.com",
  messagingSenderId: "1084715314614",
  appId: "1:1084715314614:web:4b3a734b0688bfb4c7e517"
};

export const app = initializeApp(firebaseConfig);