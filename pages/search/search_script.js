// search_script.js
import { auth, db } from "../../assets/js/firebase_config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";




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

// Helper: fetch recommendations from Flask backend
async function fetchRecommendations(likedImages, savedImages) {
  const res = await fetch('http://127.0.0.1:5000/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likedImages, savedImages })

  });

  const data = await res.json();
  return data.recommendations || [];
}

// Get user liked and closet images from Firestore
async function getUserImages() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async user => {
      if (!user) return resolve({ likedImages: [], savedImages: [] });
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) return resolve({ likedImages: [], savedImages: [] });
      const data = userDoc.data();
      resolve({
        likedImages: data.likedImages || [],
        savedImages: data.savedImages || []
      });
    });
  });
}

let outfits = [];
let pile = [];
let pileIndex = 0;

(async function initRecommendations() {
  const { likedImages, savedImages } = await getUserImages();
  const recs = await fetchRecommendations(likedImages, savedImages);
  // recs is an array of filenames, e.g. ["img_0005.jpeg", ...]
  outfits = recs.map(f => ({ src: `${f}` }));
  pile = outfits.slice(0, 5).map((outfit, i, arr) => ({
    ...outfit,
    rotate: i === arr.length - 1 ? 0 : (Math.random() * 40 - 20),
    x: i === arr.length - 1 ? 0 : (Math.random() * 60 - 30),
    y: i === arr.length - 1 ? 0 : (Math.random() * 40 - 20)
  }));
  pileIndex = 5;
  renderPile();
})();
// --- Outfit pile swipe logic with like integration ---
const pileRoot = document.getElementById('outfit-pile-root');
function renderPile() {
  if (!pileRoot) return;
  pileRoot.innerHTML = `
    <div id="outfit-pile" style="position:relative;width:800px;height:600px;margin:40px auto;">
      <button class="dislike-btn" style="
        position: absolute;
        left: -120px;
        top: 50%;
        transform: translateY(-50%);
        font-size:2.2rem;
        background:#fff;
        border-radius:50%;
        border:none;
        width:56px;
        height:56px;
        box-shadow:0 2px 8px #0002;
        cursor:pointer;
        z-index:10;
        display: block;
      ">✖</button>
      <button class="like-btn" style="
        position: absolute;
        right: -120px;
        top: 50%;
        transform: translateY(-50%);
        font-size:2.2rem;
        background:#fff;
        border-radius:50%;
        border:none;
        width:56px;
        height:56px;
        box-shadow:0 2px 8px #0002;
        cursor:pointer;
        z-index:10;
        display: block;
      ">❤</button>
      ${pile.map((outfit, i) => `
        <div class="outfit-card" data-src="${outfit.src}" style="
          position:absolute;
          top:50%;left:50%;
          transform: translate(-50%, -50%) translate(${outfit.x || 0}px, ${outfit.y || 0}px) rotate(${outfit.rotate || 0}deg);
          z-index:${pile.length - i};
          transition: transform 0.5s, opacity 0.5s;
          width:400px;
          height:600px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img src="${outfit.src}" style="
            width:440px;
            height:600px;
            border-radius:32px;
            box-shadow:0 4px 24px rgba(0,0,0,0.15);
            object-fit:contain;
            background:#fff;
            display:block;
          ">
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
        rotate: Math.random() * 30 - 20,
        x: Math.random() * 40 - 30,
        y: Math.random() * 30 - 20
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
  // Only one set of buttons, so handle clicks at the pile level
  pileRoot.addEventListener('click', function(e) {
    const pileDiv = document.getElementById('outfit-pile');
    const topCard = pileDiv && pileDiv.querySelector('.outfit-card:last-child');
    if (!topCard) return;
    if (e.target.classList.contains('like-btn')) {
      handleSwipe('right', topCard);
    } else if (e.target.classList.contains('dislike-btn')) {
      handleSwipe('left', topCard);
    }
  
    
  }); }
