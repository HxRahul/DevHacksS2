// search_script.js
import { auth, db } from "../../assets/js/firebase_config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Generate 50 outfit objects
let outfits = [];
for (let i = 1; i <= 50; i++) {
  outfits.push({
    src: `outfits/img_${i.toString().padStart(4,'0')}.jpeg`
  });
}

// Shuffle outfits
outfits = outfits.sort(() => Math.random() - 0.5);

// Maintain a pile of 5 at a time, each with a fixed rotation/scatter
let pile = outfits.slice(0, 5).map((outfit, i, arr) => ({
  ...outfit,
  rotate: i === arr.length - 1 ? 0 : (Math.random() * 40 - 20),
  x: i === arr.length - 1 ? 0 : (Math.random() * 60 - 30),
  y: i === arr.length - 1 ? 0 : (Math.random() * 40 - 20)
}));
let pileIndex = 5;

// Save liked outfit to Firestore
async function likeImage(imageSrc) {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user logged in!");
    return;
  }

  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, { likedImages: [imageSrc] });
  } else {
    await updateDoc(userDocRef, {
      likedImages: arrayUnion(imageSrc)
    });
  }
}

// --- Outfit pile swipe logic with like integration ---
const pileRoot = document.getElementById('outfit-pile-root');
function renderPile() {
  if (!pileRoot) return;
  pileRoot.innerHTML = `
    <div id="outfit-pile" style="position:relative;width:420px;height:560px;margin:40px auto;">
      ${pile.map((outfit, i) => `
        <div class="outfit-card" data-src="${outfit.src}" style="
          position:absolute;
          top:50%;left:50%;
          transform: translate(-50%, -50%) translate(${outfit.x || 0}px, ${outfit.y || 0}px) rotate(${outfit.rotate || 0}deg);
          z-index:${pile.length - i};
          transition: transform 0.5s, opacity 0.5s;
        ">
          <img src="${outfit.src}" style="width:420px;height:540px;border-radius:24px;box-shadow:0 4px 24px rgba(0,0,0,0.15);object-fit:cover;">
          <div style="position:absolute;bottom:24px;left:0;width:100%;display:flex;justify-content:space-between;padding:0 32px;">
            <button class="dislike-btn" style="font-size:2.2rem;background:#fff;border-radius:50%;border:none;width:56px;height:56px;box-shadow:0 2px 8px #0002;cursor:pointer;">✖</button>
            <button class="like-btn" style="font-size:2.2rem;background:#fff;border-radius:50%;border:none;width:56px;height:56px;box-shadow:0 2px 8px #0002;cursor:pointer;">❤</button>
          </div>
        </div>
      `).reverse().join('')}
    </div>
  `;
}

async function handleSwipe(direction, card) {
  card.style.transform += ` translateX(${direction === 'right' ? '+' : '-'}500px) rotate(${direction === 'right' ? 30 : -30}deg)`;
  card.style.opacity = 0;
  if (direction === 'right') {
    const imageSrc = card.getAttribute('data-src');
    await likeImage(imageSrc);
  }
  setTimeout(() => {
    // Remove the swiped card from the pile
    const src = card.getAttribute('data-src');
    pile = pile.filter(o => o.src !== src);
    // Add a new outfit to the bottom if available, with a new random rotation/scatter
    if (pileIndex < outfits.length) {
      pile.push({
        ...outfits[pileIndex],
        rotate: Math.random() * 40 - 20,
        x: Math.random() * 60 - 30,
        y: Math.random() * 40 - 20
      });
      pileIndex++;
    }
    // // Ensure the new top card is always centered and not rotated/scattered
    // if (pile.length > 0) {
    //   pile[pile.length - 1].rotate = 0;
    //   pile[pile.length - 1].x = 0;
    //   pile[pile.length - 1].y = 0;
    // }
    // Only keep 5 in the pile
    if (pile.length > 5) pile = pile.slice(pile.length - 5);
    renderPile();
  }, 500);
}

if (pileRoot) {
  renderPile();
  pileRoot.addEventListener('click', function(e) {
    if (e.target.classList.contains('like-btn') || e.target.classList.contains('dislike-btn')) {
      const card = e.target.closest('.outfit-card');
      if (!card) return;
      if (e.target.classList.contains('like-btn')) {
        handleSwipe('right', card);
      } else {
        handleSwipe('left', card);
      }
    }
  });
}