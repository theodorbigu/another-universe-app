from ultralytics import YOLO
import numpy as np
import cv2
import io

# Load pretrained YOLO model (YOLOv8n for speed, replace 'n' with 's', 'm', 'l', 'x' for larger models)
yolo_model = YOLO('app/model/yolov10n.pt')

def infer_yolo_model(content):
    file_bytes = np.frombuffer(content, np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Perform inference (only car class - COCO id=2)
    results = yolo_model.predict(img, classes=[2], conf=0.3)
    boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)

    return img, results, boxes

def detect_car(content):
    img, results, boxes = infer_yolo_model(content)

    # Create a mask initialized with zeros (black)
    mask = np.zeros_like(img)

    # Draw bounding boxes on the mask
    for box in boxes:
        x1, y1, x2, y2 = box
        mask[y1:y2, x1:x2] = img[y1:y2, x1:x2]

    # Encode the resulting image back to JPEG
    _, encoded_image = cv2.imencode('.jpg', mask)
    image_stream = io.BytesIO(encoded_image.tobytes())

    return image_stream