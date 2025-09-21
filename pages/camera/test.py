import cv2
from ultralytics import YOLO

#opens the webcam with live YOLO AI detection

#for original model
#model = YOLO("yolo11n.pt")

model = YOLO("pages\\camera\\ClothesData\\runs\detect\\train\\weights\\best.pt")

#change source = "1" for external camera

results = model.predict(source="0", show=True)

print(results)