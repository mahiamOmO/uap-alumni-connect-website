import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBsgfaGMZ7lcI9J_QywsrQQL0nIUlOSu4A",
  authDomain: "uap-alumni-connect.firebaseapp.com",
  projectId: "uap-alumni-connect",
  storageBucket: "uap-alumni-connect.appspot.com", 
  messagingSenderId: "141864923407",
  appId: "1:141864923407:web:6840e942b1fc86ef9b8e7a",
  measurementId: "G-HB5CQSG9MZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);