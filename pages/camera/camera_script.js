// camera_script.js
import { auth, db } from "../../assets/js/firebase_config.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const gallery = document.getElementById("gallery");
  const snapBtn = document.getElementById("snap");
  const fileInput = document.getElementById("file-input");
  const clearBtn = document.getElementById("clear-gallery");

  // Keep track of signed-in user
  // let currentUser = null;
  // onAuthStateChanged(auth, (user) => {
  //   currentUser = user;
  //   console.log("Auth state changed. currentUser:", !!user);
  //   // If user signs in/out while page open, refresh gallery from Firestore/localStorage
  //   loadGalleryFromFirestoreOrLocal();
  // });

 
  // ---------------- Webcam Capture ----------------
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      console.log("Camera started");
    } catch (err) {
      console.error("Camera error:", err);
      alert("Cannot access camera: " + err.message);
    }
  }
  startCamera();

  // ---------------- Capture Button ----------------
  snapBtn.addEventListener("click", () => {
    // scale canvas to video visible size (but cap maximum to reduce file size)
    const maxDim = 1000; // change if you want smaller/bigger images
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;
    let w = vw, h = vh;
    if (Math.max(w, h) > maxDim) {
      const scale = maxDim / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    // Use JPEG to reduce size (quality 0.7)
    const imgData = canvas.toDataURL("image/jpeg", 0.7);
    showPreview(imgData);
  });

  // ---------------- File Upload ----------------
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => showPreview(reader.result);
    reader.readAsDataURL(file);
  });

  // ---------------- Preview with Keep/Delete ----------------
  let previewWrapper = null;
  function showPreview(imgData) {
    // hide video
    video.style.display = "none";

    // create wrapper overlay that is same width as video element
    previewWrapper = document.createElement("div");
    previewWrapper.className = "preview-wrapper";
    previewWrapper.style.position = "relative";
    previewWrapper.style.display = "inline-block";

    const previewImg = document.createElement("img");
    previewImg.src = imgData;
    previewImg.className = "preview-img";
    previewImg.style.display = "block";
    previewImg.style.maxWidth = getComputedStyle(video).width || "600px";

    // create floating buttons
    const keepBtn = document.createElement("button");
    keepBtn.innerText = "Keep";
    keepBtn.className = "preview-btn keep-btn";

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "preview-btn delete-btn";

    keepBtn.addEventListener("click", async () => {
      const user = auth.currentUser;
  if (!user) {
    console.error("No user logged in!");
    return;
  }

  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, { savedImages: [imgData] });
  } else {
    await updateDoc(userDocRef, {
      savedImages: arrayUnion(imgData)
    });
  }
  closePreview();
});
deleteBtn.addEventListener("click", () => {
  closePreview(); // discard image
    });

    previewWrapper.appendChild(previewImg);
    previewWrapper.appendChild(keepBtn);
    previewWrapper.appendChild(deleteBtn);

    // insert wrapper after video
    video.parentNode.insertBefore(previewWrapper, video.nextSibling);

    // small style adjustments for positioning (if your CSS doesn't apply)
    keepBtn.style.position = deleteBtn.style.position = "absolute";
    keepBtn.style.bottom = deleteBtn.style.bottom = "12px";
    keepBtn.style.left = "12px";
    deleteBtn.style.right = "12px";
    keepBtn.style.padding = deleteBtn.style.padding = "10px 14px";
    keepBtn.style.background = "green";
    deleteBtn.style.background = "red";
    keepBtn.style.color = deleteBtn.style.color = "#fff";
    keepBtn.style.border = deleteBtn.style.border = "none";
    keepBtn.style.borderRadius = deleteBtn.style.borderRadius = "6px";
    keepBtn.style.cursor = deleteBtn.style.cursor = "pointer";
  }

  function closePreview() {
    if (previewWrapper) {
      previewWrapper.remove();
      previewWrapper = null;
    }
    video.style.display = "block";
  }

  // ---------------- Display galleries ----------------
  async function loadGalleryFromFirestoreOrLocal() {
    // First show local images
    displayGalleryLocal();

    if (!currentUser) {
      console.log("Not signed in — will not fetch Firestore gallery.");
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.log("No Firestore user doc for photos.");
        return;
      }
      const photos = userDoc.data().photos || [];
      displayGalleryFromArray(photos, true); // true indicates Firestore set
    } catch (err) {
      console.error("Error reading Firestore photos:", err);
    }
  }

  function displayGalleryLocal() {
    const local = JSON.parse(localStorage.getItem("myPhotos_local")) || [];
    displayGalleryFromArray(local, false);
  }

  function displayGalleryFromArray(arrayOfDataURLs, isFirestore) {
    // append to gallery, separate by source
    // Clear and re-render
    gallery.innerHTML = "";

    if (!isFirestore && arrayOfDataURLs.length === 0) {
      // Show message if nothing anywhere (but do not overwrite if firestore below will add)
      // we still allow below to add firestore images
    }

    arrayOfDataURLs.forEach((dataURL, idx) => {
      const wrapper = document.createElement("div");
      wrapper.style.display = "inline-block";
      wrapper.style.margin = "8px";
      const img = document.createElement("img");
      img.src = dataURL;
      img.width = 200;
      img.style.display = "block";

      // delete control (local or firestore)
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.style.display = "block";
      del.style.marginTop = "6px";
      del.addEventListener("click", async () => {
        if (isFirestore) {
          // remove from firestore
          const userRef = doc(db, "users", currentUser.uid);
          await updateDoc(userRef, { photos: arrayRemove(dataURL) }).catch(e => console.error(e));
          loadGalleryFromFirestoreOrLocal();
        } else {
          // remove from local
          const local = JSON.parse(localStorage.getItem("myPhotos_local")) || [];
          local.splice(idx, 1);
          localStorage.setItem("myPhotos_local", JSON.stringify(local));
          displayGalleryLocal();
        }
      });

      wrapper.appendChild(img);
      wrapper.appendChild(del);
      gallery.appendChild(wrapper);
    });
  }

  // ---------------- Clear gallery (local only) ----------------
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("myPhotos_local");
    displayGalleryLocal();
  });

  // initial load
  loadGalleryFromFirestoreOrLocal();
});
