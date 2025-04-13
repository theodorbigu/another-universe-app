from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
import os
from dotenv import load_dotenv
from openai import OpenAI
import requests
from fastapi import HTTPException
from pydantic import BaseModel

from app.services.DetectionService import detect_car
from app.services.SegmentationService import segment_car


app = FastAPI()

# Load environment variables from .env file
load_dotenv()

# Retrieve OpenAI API Key securely
openai_key = os.getenv("OPENAI_API_KEY")
if openai_key is None:
    raise RuntimeError("Missing OpenAI API key")

# Initialize OpenAI client
client = OpenAI(api_key=openai_key)


# Pydantic model to ensure request input validation
class ImageRequest(BaseModel):
    prompt: str
    size: str = "1024x1024"  # Default size, adjustable
    quality: str = "standard"  # Options: standard or hd (high definition)


@app.post("/detect-cars")
async def detect_cars(file: UploadFile = File(...)):
    # Read image content
    content = await file.read()

    image_stream = detect_car(content)  # Call the detection function

    return StreamingResponse(image_stream, media_type="image/jpg")


@app.post("/car-segmentation-sam")
async def car_segmentation_sam(file: UploadFile = File(...)):
    # Read image from uploaded file
    content = await file.read()

    image_stream = segment_car(content)  # Call the segmentation function

    return StreamingResponse(image_stream, media_type="image/jpg")


@app.post("/generate-image/")
def generate_image(request: ImageRequest):
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=request.prompt,
            size=request.size,
            quality=request.quality,
            n=1
        )
        image_url = response.data[0].url

        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            return StreamingResponse(
                response.raw,
                media_type="image/jpg",
                headers={"Content-Disposition": "inline; filename=generated_image.png"}
            )
        else:
            raise HTTPException(status_code=400, detail="Could not fetch image from remote server.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))