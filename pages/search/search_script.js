// search_script.js
import { auth, db } from "../../../assets/js/firebase_config.js";
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
