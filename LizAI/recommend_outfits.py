import os
from google.cloud import firestore
from PIL import Image
from fashion_clip.fashion_clip import FashionCLIP
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# --- CONFIG ---
# Set your Google Cloud credentials (or set GOOGLE_APPLICATION_CREDENTIALS env var)
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "path/to/your/service-account.json"

USER_UID = "BgeQcLYJxHOigwUdzaaAwfrqzw13"  # TODO: Replace with actual user UID
OUTFITS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'pages', 'search', 'outfits'))

# --- 1. Fetch liked and closet images from Firestore ---
def fetch_user_images(uid):
    db = firestore.Client()
    user_doc = db.collection("users").document(uid).get()
    if not user_doc.exists:
        return set()
    data = user_doc.to_dict()
    liked = set(data.get("likedImages", []))
    closet = set(data.get("savedImages", []))
    return liked.union(closet)

# --- 2. List all outfit images not in liked/closet ---
def get_unliked_outfit_images(all_liked):
    all_imgs = [f for f in os.listdir(OUTFITS_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    return [img for img in all_imgs if img not in all_liked]

# --- 3. Compute similarity using FashionCLIP ---
def compute_recommendations(liked_imgs, unliked_imgs):
    fclip = FashionCLIP("fashion-clip")
    # Load liked images
    liked_paths = [os.path.join(OUTFITS_DIR, img) for img in liked_imgs]
    liked_images = [Image.open(p) for p in liked_paths if os.path.exists(p)]
    if not liked_images:
        return []
    liked_embs = fclip.encode_images(liked_images, batch_size=4)
    # For each unliked image, compute avg similarity to all liked
    recs = []
    for img in unliked_imgs:
        img_path = os.path.join(OUTFITS_DIR, img)
        if not os.path.exists(img_path):
            continue
        uimg = Image.open(img_path)
        uemb = fclip.encode_images([uimg], batch_size=1)
        sim = cosine_similarity(uemb, liked_embs)
        avg_sim = np.mean(sim)
        recs.append((img, float(avg_sim)))
    # Sort by similarity descending
    recs.sort(key=lambda x: x[1], reverse=True)
    return recs

# --- 4. Main logic ---
def main():
    liked_imgs = fetch_user_images(USER_UID)
    unliked_imgs = get_unliked_outfit_images(liked_imgs)
    recs = compute_recommendations(liked_imgs, unliked_imgs)
    # Output: list of (filename, similarity)
    print("Recommended images (most similar first):")
    for img, sim in recs:
        print(f"{img}: {sim:.4f}")
    # Optionally, write to a JSON file for frontend use
    import json
    with open("recommendations.json", "w") as f:
        json.dump([img for img, _ in recs], f)

if __name__ == "__main__":
    main()
