// firebase-config.js
console.log('firebase_config.js loaded');

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsq8jy85O9JYFwACfFGmBBRWGq-jOv6Ck",
  authDomain: "fashn-devhacks.firebaseapp.com", // <-- must match your domain
  projectId: "fashn-devhacks",
  storageBucket: "fashn-devhacks.appspot.com",
  messagingSenderId: "523104349054",
  appId: "1:523104349054:web:64cede482107055da9612f",
  measurementId: "G-NYHFZYSTT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export so other scripts can use it
export { app, auth, db };
