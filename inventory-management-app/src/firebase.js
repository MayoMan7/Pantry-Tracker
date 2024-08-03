// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics"; // Import Analytics (optional)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmpwvC5IkUwDf-h114WjMCDSJ4pSN8nvk",
  authDomain: "inventory-management-app-abbf7.firebaseapp.com",
  projectId: "inventory-management-app-abbf7",
  storageBucket: "inventory-management-app-abbf7.appspot.com",
  messagingSenderId: "251648052348",
  appId: "1:251648052348:web:2d436423e473147c730df9",
  measurementId: "G-R3996DWXT1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

export { db, analytics };
