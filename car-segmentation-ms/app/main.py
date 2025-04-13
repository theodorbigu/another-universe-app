from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from segment_anything import sam_model_registry, SamPredictor
from ultralytics import YOLO
import numpy as np
import cv2
import io
import torch

app = FastAPI()

# Load pretrained YOLO model (YOLOv8n for speed, replace 'n' with 's', 'm', 'l', 'x' for larger models)
yolo_model = YOLO('app/model/yolov10n.pt')

# Setup SAM model and mask generator (SAM)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CHECKPOINT_PATH = "app/model/sam_vit_b_01ec64.pth"  # Change if you have placed your weights elsewhere
MODEL_TYPE = "vit_b"  # or "vit_l", "vit_h" depending on your checkpoint

sam = sam_model_registry[MODEL_TYPE](checkpoint=CHECKPOINT_PATH).to(DEVICE)
sam_predictor = SamPredictor(sam)


@app.post("/detect-cars")
async def detect_cars(file: UploadFile = File(...)):
    # Read image content
    content = await file.read()
    file_bytes = np.frombuffer(content, np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Perform inference (only car class - COCO id=2)
    results = model.predict(img, classes=[2], conf=0.3)
    boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)

    # Create a mask initialized with zeros (black)
    mask = np.zeros_like(img)

    # Set pixels within detected bounding boxes to original values
    for box in boxes:
        x1, y1, x2, y2 = box
        mask[y1:y2, x1:x2] = img[y1:y2, x1:x2]

    # Encode the resulting image back to JPEG
    _, encoded_image = cv2.imencode('.jpg', mask)
    image_stream = io.BytesIO(encoded_image.tobytes())

    return StreamingResponse(image_stream, media_type="image/jpeg")


@app.post("/car-segmentation-sam")
async def car_segmentation_sam(file: UploadFile = File(...)):
    # Read image from uploaded file
    content = await file.read()
    file_bytes = np.frombuffer(content, np.uint8)
    img_bgr = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    # YOLO car detection (class=2 for "car")
    yolo_results = yolo_model.predict(img_rgb, classes=[2], conf=0.3)
    boxes = yolo_results[0].boxes.xyxy.cpu().numpy().astype(int)

    if boxes.size == 0:
        return {"message": "No cars detected in image."}

    # SAM predictor requires RGB image for setup
    sam_predictor.set_image(img_rgb)

    # Gather masks from SAM using bounding boxes as prompts
    car_mask_final = np.zeros(img_rgb.shape[:2], dtype=bool)  # Initialize empty mask
    for box in boxes:
        x1, y1, x2, y2 = box
        bbox = np.array([x1, y1, x2, y2])
        masks, _, _ = sam_predictor.predict(box=bbox, multimask_output=False)
        car_mask_final |= masks[0].astype(bool)  # Combine masks of all cars

    # Apply final mask to original image (other areas blacked out)
    masked_img = np.zeros_like(img_bgr)
    masked_img[car_mask_final] = img_bgr[car_mask_final]

    # Encode masked image to JPEG
    _, encoded_image = cv2.imencode('.jpg', masked_img)
    image_stream = io.BytesIO(encoded_image.tobytes())

    return StreamingResponse(image_stream, media_type="image/jpeg")

