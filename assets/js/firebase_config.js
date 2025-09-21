// dashboard.js - Firebase Auth setup for browser (CDN)
console.log('firebase_config.js loaded');
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsq8jy85O9JYFwACfFGmBBRWGq-jOv6Ck",
  authDomain: "fashn-devhacks.firebaseapp.com",
  projectId: "fashn-devhacks",
  storageBucket: "fashn-devhacks.firebasestorage.app",
  messagingSenderId: "523104349054",
  appId: "1:523104349054:web:64cede482107055da9612f",
  measurementId: "G-NYHFZYSTT5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
