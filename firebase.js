// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAga_hctoW9sELHQZrpqHtkBmptgqF2Cbw",
  authDomain: "pantry-tracker-aedc3.firebaseapp.com",
  projectId: "pantry-tracker-aedc3",
  storageBucket: "pantry-tracker-aedc3.appspot.com",
  messagingSenderId: "589394575429",
  appId: "1:589394575429:web:a5f74e92c48ca1e346e32c",
  measurementId: "G-TZ1VR2S79Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}