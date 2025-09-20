import { initializeApp } from "../../../assets/js/firebase_config.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const auth = getAuth();

const signInForm = document.getElementById('signInForm');
const registerForm = document.getElementById('registerForm');
const authMessage = document.getElementById('authMessage');

signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = '../search/search.html';
  } catch (error) {
    authMessage.textContent = error.message;
    authMessage.style.color = 'red';
  }
});

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
