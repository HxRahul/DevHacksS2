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

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, user => {
    displayLikedImages(user);
  });
});
