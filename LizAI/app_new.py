from recommend_outfits import compute_recommendations, get_unliked_outfit_images, fetch_user_images
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

OUTFITS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'pages', 'search', 'outfits'))

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    liked = set(data.get('likedImages', []))
    closet = set(data.get('savedImages', []))
    all_liked = liked.union(closet)
    unliked_imgs = get_unliked_outfit_images(all_liked)
    # If no liked/closet, just return all images with 0 similarity
    if not all_liked:
        recs = [(img, 0.0) for img in unliked_imgs]
    else:
        recs = compute_recommendations(all_liked, unliked_imgs)
    # Return list of dicts: {filename, similarity}
    return jsonify({
        "recommendations": [
            {"filename": img, "similarity": sim} for img, sim in recs
        ]
    })

if __name__ == '__main__':
    app.run(debug=True)
