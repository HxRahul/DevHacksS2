import { auth } from "../../../assets/js/firebase_config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";



const signInForm = document.getElementById('signInForm');
const registerForm = document.getElementById('registerForm');
const authMessage = document.getElementById('authMessage');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const googleSignUpBtn = document.getElementById('googleSignUpBtn');


if (signInForm) {
  
  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'pages/search/search.html';
    } catch (error) {
      authMessage.textContent = error.message;
      authMessage.style.color = 'red';
    }
  });
}



if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      authMessage.textContent = 'Registration successful! You can now sign in.';
      authMessage.style.color = 'green';
    } catch (error) {
      authMessage.textContent = error.message;
      authMessage.style.color = 'red';
    }
  });
}


if (googleSignInBtn) {
  const provider = new GoogleAuthProvider();
  googleSignInBtn.addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = 'pages/search/search.html';
    } catch (error) {
      authMessage.textContent = error.message;
      authMessage.style.color = 'red';
    }
  });
}

if (googleSignUpBtn) {
  const provider = new GoogleAuthProvider();
  googleSignUpBtn.addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
      // Optionally, you can check if the user is new and show a message
      window.location.href = 'pages/search/search.html';
    } catch (error) {
      authMessage.textContent = error.message;
      authMessage.style.color = 'red';
    }
  });
}
