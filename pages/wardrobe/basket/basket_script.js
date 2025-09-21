let basket = JSON.parse(localStorage.getItem("basket")) || [];

const gallery = document.getElementById("basket-gallery");

basket.forEach(outfit => {
    const img = document.createElement("img");
    
    // Extract filename from original outfit.src (like "./outfits/img_0006.jpeg")
    const filename = outfit.src.split('/').pop(); 
    
    // Build correct path relative to basket.html
    img.src = `../../search/outfits/${filename}`;
    
    img.width = 200;
    img.style.margin = "10px";
    img.style.cursor = "pointer";
    gallery.appendChild(img);
});
