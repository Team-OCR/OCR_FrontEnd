// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDifZJO_maivQJfsnxtwJequ54tY2Kbadw",
  authDomain: "ocrfirebase-f839c.firebaseapp.com",
  projectId: "ocrfirebase-f839c",
  storageBucket: "ocrfirebase-f839c.firebasestorage.app",
  messagingSenderId: "533066522025",
  appId: "1:533066522025:web:35475717cf31ee34b838b8",
  measurementId: "G-YCF5PERS43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
