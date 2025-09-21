// camera_script.js
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const gallery = document.getElementById("gallery");
  const snapBtn = document.getElementById("snap");
  const fileInput = document.getElementById("file-input");
  const clearBtn = document.getElementById("clear-gallery");

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
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgData = canvas.toDataURL("image/png");
    savePhoto(imgData);
  });

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

      // Remove photo on click
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

  // Show existing photos on load
  displayGallery();
});
