import cv2, os
from ultralytics import YOLO

#takes a picture with the webcam, analyze with YOLO, delete the picture

# Load a pretrained YOLO11n model
model = YOLO("yolo11n.pt")

# Initialize the video capture object for the default webcam (index 0)
cap = cv2.VideoCapture(0)

# Check if the webcam was opened successfully
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

# Read a single frame from the webcam
ret, frame = cap.read()

if ret:
    # Save the captured frame as an image file
    cv2.imwrite("temp.jpg", frame)
    print("Image captured and saved as 'temp.jpg'")
else:
    print("Error: Could not read frame from webcam.")

results = model("temp.jpg")
print(results)



try:
    os.remove("temp.jpg")
    print(f"File '{"temp.jpg"}' deleted successfully.")
except FileNotFoundError:
    print(f"Error: File '{"temp.jpg"}' not found.")
except PermissionError:
    print(f"Error: Permission denied to delete '{"temp.jpg"}'.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

# Release the VideoCapture object and close any OpenCV windows
cap.release()
cv2.destroyAllWindows()