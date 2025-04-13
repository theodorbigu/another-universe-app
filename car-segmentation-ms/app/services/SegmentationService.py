from segment_anything import sam_model_registry, SamPredictor
import numpy as np
import cv2
import io
import torch
from app.services.DetectionService import infer_yolo_model


# Setup SAM model and mask generator (SAM)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CHECKPOINT_PATH = "app/model/sam_vit_b_01ec64.pth"  # Change if you have placed your weights elsewhere
MODEL_TYPE = "vit_b"  # or "vit_l", "vit_h" depending on your checkpoint

sam = sam_model_registry[MODEL_TYPE](checkpoint=CHECKPOINT_PATH).to(DEVICE)
sam_predictor = SamPredictor(sam)

def segment_car(content):
    img, yolo_results, boxes = infer_yolo_model(content)

    if boxes.size == 0:
        return {"message": "No cars detected in image."}

    # SAM predictor requires RGB image for setup
    sam_predictor.set_image(img)

    # Gather masks from SAM using bounding boxes as prompts
    car_mask_final = np.zeros(img.shape[:2], dtype=bool)  # Initialize empty mask
    
    for box in boxes:
        x1, y1, x2, y2 = box
        bbox = np.array([x1, y1, x2, y2])
        masks, _, _ = sam_predictor.predict(box=bbox, multimask_output=False)
        car_mask_final |= masks[0].astype(bool)  # Combine masks of all cars

    # Apply final mask to original image (other areas blacked out)
    masked_img = np.zeros_like(img)
    masked_img[car_mask_final] = img[car_mask_final]

    # Encode masked image to JPEG
    _, encoded_image = cv2.imencode('.jpg', masked_img)
    image_stream = io.BytesIO(encoded_image.tobytes())

    return image_stream