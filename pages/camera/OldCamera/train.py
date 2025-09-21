from ultralytics import YOLO, checks, hub
checks()

hub.login('82ac912814ef77248c06f4182a4bcb9674de72e8f5')

model = YOLO('https://hub.ultralytics.com/models/Z4kmXHqnoc19Zdavy0QE')
results = model.train()