// camera_script.js
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const gallery = document.getElementById("gallery");
  const snapBtn = document.getElementById("snap");
  const fileInput = document.getElementById("file-input");
  const clearBtn = document.getElementById("clear-gallery");

  let previewWrapper, previewImg, keepBtn, deleteBtn;

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
    // Resize canvas to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgData = canvas.toDataURL("image/png");

    showPreview(imgData);
  });

  // ---------------- Preview with Keep/Delete ----------------
  function showPreview(imgData) {
    // Hide video
    video.style.display = "none";

    // Create wrapper
    previewWrapper = document.createElement("div");
    previewWrapper.classList.add("preview-wrapper");

    // Create image
    previewImg = document.createElement("img");
    previewImg.src = imgData;
    previewImg.classList.add("preview-img");

    // Create Keep button
    keepBtn = document.createElement("button");
    keepBtn.innerText = "Keep";
    keepBtn.classList.add("preview-btn", "keep-btn");
    keepBtn.addEventListener("click", () => {
      savePhoto(imgData);
      closePreview();
    });

    // Create Delete button
    deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("preview-btn", "delete-btn");
    deleteBtn.addEventListener("click", () => {
      closePreview();
    });

    // Add elements
    previewWrapper.appendChild(previewImg);
    previewWrapper.appendChild(keepBtn);
    previewWrapper.appendChild(deleteBtn);
    video.parentNode.insertBefore(previewWrapper, video.nextSibling);
  }

  function closePreview() {
    if (previewWrapper) {
      previewWrapper.remove();
      previewWrapper = null;
    }
    video.style.display = "block";
  }

  // ---------------- File Upload ----------------
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => savePhoto(reader.result);
    reader.readAsDataURL(file);
  });

  // ---------------- Save Photo ----------------
  function savePhoto(dataURL) {
    let photos = JSON.parse(localStorage.getItem("myPhotos")) || [];
    photos.push(dataURL);
    localStorage.setItem("myPhotos", JSON.stringify(photos));
    displayGallery();
  }

  // ---------------- Display Gallery ----------------
  function displayGallery() {
    gallery.innerHTML = "";
    const photos = JSON.parse(localStorage.getItem("myPhotos")) || [];

    photos.forEach((dataURL, index) => {
      const img = document.createElement("img");
      img.src = dataURL;
      img.width = 200;
      img.style.margin = "10px";
      img.style.cursor = "pointer";

      img.addEventListener("click", () => {
        photos.splice(index, 1);
        localStorage.setItem("myPhotos", JSON.stringify(photos));
        displayGallery();
      });

      gallery.appendChild(img);
    });
  }

  // ---------------- Clear Gallery ----------------
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("myPhotos");
    displayGallery();
  });

  displayGallery();
});
