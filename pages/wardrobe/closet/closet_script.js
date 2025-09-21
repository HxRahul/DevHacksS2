import { auth, db } from "../../../assets/js/firebase_config.js";
import { doc, getDoc, updateDoc, arrayRemove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

function clearClosetDisplay() {
  const root = document.getElementById("closet-root");
  if (root) root.innerHTML = "";
}

async function displayLikedImages(user) {
  const root = document.getElementById('closet-root');
  clearClosetDisplay();
  console.log('displayLikedImages called. user:', user);
  if (!user) {
    const msg = document.createElement('p');
    msg.id = 'closet-msg';
    msg.textContent = 'Please sign in to view your closet.';
    root.appendChild(msg);
    return;
  }
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);
  console.log('userDoc.exists:', userDoc.exists());
  if (!userDoc.exists()) {
    const msg = document.createElement('p');
    msg.id = 'closet-msg';
    msg.textContent = 'No liked images found.';
    root.appendChild(msg);
    return;
  }
  const data = userDoc.data();
  console.log('userDoc.data:', data);
  if (!data.savedImages || data.savedImages.length === 0) {
    const msg = document.createElement('p');
    msg.id = 'closet-msg';
    msg.textContent = 'No saved images found.';
    root.appendChild(msg);
    return;
  }
  const savedImages = data.savedImages;
  console.log('savedImages:', savedImages);
  const container = document.createElement('div');
  container.id = 'saved-images-container';
  savedImages.forEach(src => {
    console.log('Rendering image:', src);
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Saved Outfit';
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

