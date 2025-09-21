from PIL import Image
from fashion_clip.fashion_clip import FashionCLIP
from sklearn.metrics.pairwise import cosine_similarity
import os

# Load FashionCLIP pretrained model
fclip = FashionCLIP("fashion-clip")

# Get absolute path to the images, regardless of where script is run from
script_dir = os.path.dirname(os.path.abspath(__file__))
img1_path = os.path.join(script_dir, '..', 'pages', 'search', 'outfits', 'img_0003.jpeg')
img2_path = os.path.join(script_dir, '..', 'pages', 'search', 'outfits', 'img_0004.jpeg')

# Load images
image1 = Image.open(img1_path)
image2 = Image.open(img2_path)


# Generate embeddings (add batch_size argument)
emb1 = fclip.encode_images([image1], batch_size=1)
emb2 = fclip.encode_images([image2], batch_size=1)

# Print embedding shape
print("Embedding 1 shape:", emb1.shape)

# Compare similarity
sim = cosine_similarity(emb1, emb2)
print("Similarity score between outfit1 and outfit2:", sim[0][0])

# Activate virtual environment
# Note: This line is a comment now. To activate the virtual environment, run the following command in your terminal:
# venv\Scripts\activate

