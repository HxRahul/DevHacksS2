let outfits = [];

// Generate 50 outfits
for (let i = 1; i <= 50; i++) {
  outfits.push({
    src: `./outfits/img_${i.toString().padStart(4,'0')}.jpeg`
  });
}

// Shuffle outfits
outfits = outfits.sort(() => Math.random() - 0.5);

let currentIndex = 0;
let basket = JSON.parse(localStorage.getItem("basket")) || [];

function showOutfit() {
  if (currentIndex < outfits.length) {
    document.getElementById("outfit-img").src = outfits[currentIndex].src;
  } else {
    document.getElementById("outfit-container").innerHTML = "<p>No more outfits!</p>";
  }
}

// Like button
document.getElementById("like").addEventListener("click", () => {
  basket.push(outfits[currentIndex]);
  localStorage.setItem("basket", JSON.stringify(basket));
  currentIndex++;
  showOutfit();
});

// Dislike button
document.getElementById("dislike").addEventListener("click", () => {
  currentIndex++;
  showOutfit();
});

// Show first outfit on load
showOutfit();
