// assets/js/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsq8jy85O9JYFwACfFGmBBRWGq-jOv6Ck",
  authDomain: "fashn-devhacks.firebaseapp.com",
  projectId: "fashn-devhacks",
  storageBucket: "fashn-devhacks.appspot.com",
  messagingSenderId: "523104349054",
  appId: "1:523104349054:web:64cede482107055da9612f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the authentication service instance
const auth = getAuth(app);

export { app, auth };
