// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXPb_GIvxWHP4MDU2dc0Ywtuf8CHtPO8w",
  authDomain: "email-management-app-c49c1.firebaseapp.com",
  projectId: "email-management-app-c49c1",
  storageBucket: "email-management-app-c49c1.firebasestorage.app",
  messagingSenderId: "1063079581260",
  appId: "1:1063079581260:web:eda2f3ea6b9e10a87a46e9",
  measurementId: "G-37EBFHMCQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { app, auth, googleProvider };
