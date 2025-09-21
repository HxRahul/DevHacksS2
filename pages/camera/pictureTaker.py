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

detected_objects = []

results = model("temp.jpg")

#gets whatever was detected in the image and puts it in a list
for r in results:
    for box in r.boxes:
        cls_id = int(box.cls[0])         # class ID
        label = r.names[cls_id]          # class name string
        detected_objects.append(label)



#detected_str = ", ".join(detected_objects)
#print("Detected Objects (list):", detected_objects)
#print("Detected Objects (string):", detected_str)


with open("tempfile.txt", 'w') as file:
    for i in range(len(detected_objects)):
        file.write(detected_objects[i] + "\n")



#remove the image
try:
    os.remove("temp.jpg")
    print(f"File '{"temp.jpg"}' deleted successfully.")
except FileNotFoundError:
    print(f"Error: File '{"temp.jpg"}' not found.")
except PermissionError:
    print(f"Error: Permission denied to delete '{"temp.jpg"}'.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

"""
#remove the text file
try:
    os.remove("tempfile.txt")
    print(f"File '{"tempfile.txt"}' deleted successfully.")
except FileNotFoundError:
    print(f"Error: File '{"tempfile.txt"}' not found.")
except PermissionError:
    print(f"Error: Permission denied to delete '{"tempfile.txt"}'.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
"""

#remove the random yolo file
try:
    os.remove("yolo11n.pt")
    print(f"File '{"yolo11n.pt"}' deleted successfully.")
except FileNotFoundError:
    print(f"Error: File '{"yolo11n.pt"}' not found.")
except PermissionError:
    print(f"Error: Permission denied to delete '{"yolo11n.pt"}'.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

#empty the array
detected_objects = []


# Release the VideoCapture object and close any OpenCV windows
cap.release()
cv2.destroyAllWindows()