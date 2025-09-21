import { auth, db } from "../../../assets/js/firebase_config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

function clearBasketDisplay() {
  const root = document.getElementById('liked-images-root');
  if (root) root.innerHTML = '';
}

async function displayLikedImages(user) {
  const root = document.getElementById('liked-images-root');
  clearBasketDisplay();
  console.log('displayLikedImages called. user:', user);
  if (!user) {
    const msg = document.createElement('p');
    msg.id = 'basket-msg';
    msg.textContent = 'Please sign in to view your basket.';
    root.appendChild(msg);
    return;
  }
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);
  console.log('userDoc.exists:', userDoc.exists());
  if (!userDoc.exists()) {
    const msg = document.createElement('p');
    msg.id = 'basket-msg';
    msg.textContent = 'No liked images found.';
    root.appendChild(msg);
    return;
  }
  const data = userDoc.data();
  console.log('userDoc.data:', data);
  if (!data.likedImages || data.likedImages.length === 0) {
    const msg = document.createElement('p');
    msg.id = 'basket-msg';
    msg.textContent = 'No liked images found.';
    root.appendChild(msg);
    return;
  }
  const likedImages = data.likedImages;
  console.log('likedImages:', likedImages);
  const container = document.createElement('div');
  container.id = 'liked-images-container';
  likedImages.forEach(src => {
    console.log('Rendering image:', src);
    const img = document.createElement('img');
    img.src = "../../search/" + src;
    img.alt = 'Liked Outfit';
    img.width = 200;
    img.style.margin = '10px';
    container.appendChild(img);
  });
  root.appendChild(container);
}

// Example outfits (replace with your real data)
const outfits = [
  { id: 1, img: 'outfit1.jpg' },
  { id: 2, img: 'outfit2.jpg' },
  { id: 3, img: 'outfit3.jpg' }
];

const root = document.getElementById('liked-images-root');
if (root) {
  root.innerHTML = `
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

  root.addEventListener('click', function(e) {
    if (e.target.classList.contains('like-btn')) {
      // Find the topmost outfit card (last in DOM order)
      const pile = document.getElementById('outfit-pile');
      if (!pile) return;
      const cards = pile.querySelectorAll('.outfit-card');
      if (!cards.length) return;
      const topCard = cards[cards.length - 1];
      // Animate swipe right
      topCard.style.transition = 'transform 0.5s, opacity 0.5s';
      topCard.style.transform = 'translateX(600px) rotate(30deg)';
      topCard.style.opacity = 0;
      setTimeout(() => {
        topCard.remove();
      }, 500);
    }
    if (e.target.classList.contains('dislike-btn')) {
      handleSwipe('left');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, user => {
    displayLikedImages(user);
  });
});
