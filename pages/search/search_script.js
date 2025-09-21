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

let currentIndex = 0;

// Show outfit
function showOutfit() {
  if (currentIndex < outfits.length) {
    document.getElementById("outfit-img").src = outfits[currentIndex].src;
  } else {
    document.getElementById("outfit-container").innerHTML = "<p>No more outfits!</p>";
  }
}

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

// Like button
document.getElementById("like").addEventListener("click", async () => {
  const imageSrc = outfits[currentIndex].src;
  await likeImage(imageSrc);
  currentIndex++;
  showOutfit();
});

// Dislike button
document.getElementById("dislike").addEventListener("click", () => {
  currentIndex++;
  showOutfit();
});

// Initial outfit display
showOutfit();
