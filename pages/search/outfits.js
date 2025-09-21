import { auth, db } from "../../assets/js/firebase_config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
      // Fallback to redirect if popup fails
      try {
        await signInWithRedirect(auth, provider);
      } catch (redirectError) {
        console.error(redirectError);
      }
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
      window.location.href = 'pages/search/search.html';
    } catch (error) {
      // Fallback to redirect if popup fails
      try {
        await signInWithRedirect(auth, provider);
      } catch (redirectError) {
        console.error(redirectError);
      }
      authMessage.textContent = error.message;
      authMessage.style.color = 'red';
    }
  });
}

// Example data, replace with your real outfit data
const outfits = [
  { id: 1, img: 'outfit1.jpg' },
  { id: 2, img: 'outfit2.jpg' },
  { id: 3, img: 'outfit3.jpg' }
];

const pileRoot = document.getElementById('outfit-pile-root');
if (pileRoot) {
  pileRoot.innerHTML = `
    <div id="outfit-pile" style="position:relative;width:320px;height:420px;margin:40px auto;">
      ${outfits.map((outfit, i) => `
        <div class="outfit-card" data-id="${outfit.id}" style="
          position:absolute;
          top:${i * 12}px;
          left:${i * 12}px;
          z-index:${outfits.length - i};
          transition: transform 0.5s, opacity 0.5s;
        ">
          <img src="${outfit.img}" style="width:320px;height:400px;border-radius:24px;box-shadow:0 4px 24px rgba(0,0,0,0.15);object-fit:cover;">
          <div style="position:absolute;bottom:16px;left:0;width:100%;display:flex;justify-content:space-between;padding:0 24px;">
            <button class="dislike-btn" style="font-size:2rem;background:#fff;border-radius:50%;border:none;width:48px;height:48px;box-shadow:0 2px 8px #0002;cursor:pointer;">✖</button>
            <button class="like-btn" style="font-size:2rem;background:#fff;border-radius:50%;border:none;width:48px;height:48px;box-shadow:0 2px 8px #0002;cursor:pointer;">❤</button>
          </div>
        </div>
      `).reverse().join('')}
    </div>
  `;

  function handleSwipe(direction) {
    const pile = document.getElementById('outfit-pile');
    const cards = pile.querySelectorAll('.outfit-card');
    if (!cards.length) return;
    const topCard = cards[cards.length - 1];
    topCard.style.transform = `translateX(${direction === 'right' ? '+' : '-'}500px) rotate(${direction === 'right' ? 30 : -30}deg)`;
    topCard.style.opacity = 0;
    setTimeout(() => {
      topCard.remove();
    }, 500);
  }

  pileRoot.addEventListener('click', function(e) {
    if (e.target.classList.contains('like-btn')) {
      handleSwipe('right');
    }
    if (e.target.classList.contains('dislike-btn')) {
      handleSwipe('left');
    }
  });
}