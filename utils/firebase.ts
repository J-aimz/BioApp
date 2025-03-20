// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHTnHhoshqYU5YbTUQwzgnF-jjiQOeKTc",
  authDomain: "biodata-1e650.firebaseapp.com",
  projectId: "biodata-1e650",
  storageBucket: "biodata-1e650.firebasestorage.app",
  messagingSenderId: "992361546306",
  appId: "1:992361546306:web:54bbd60f7c39d12ffb23db",
  measurementId: "G-FJGE1NW444"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);

isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});