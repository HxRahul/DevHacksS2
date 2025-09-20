// assets/js/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCsq8jy85O9JYFwACfFGmBBRWGq-jOv6Ck",
  authDomain: "fashn-devhacks.firebaseapp.com",
  projectId: "fashn-devhacks",
  storageBucket: "fashn-devhacks.appspot.com",
  messagingSenderId: "523104349054",
  appId: "1:523104349054:web:64cede482107055da9612f",
});

const auth = getAuth(firebaseConfig);
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
    } else {
    console.log("No user is signed in.");
    }
});
