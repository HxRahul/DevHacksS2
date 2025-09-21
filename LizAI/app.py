from flask import Flask, request, jsonify
import os
# Import your recommendation logic here
# from recommend_outfits import main as recommend_main

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    # Example: expects {"likedImages": [...], "savedImages": [...]} from frontend
    liked = set(data.get('likedImages', []))
    closet = set(data.get('savedImages', []))
    # Call your recommendation logic here, e.g.:
    # recs = recommend_main(liked, closet)
    # For now, just echo the input for testing
    recs = list(liked.union(closet))
    return jsonify({"recommendations": recs})

if __name__ == '__main__':
    app.run(debug=True)
