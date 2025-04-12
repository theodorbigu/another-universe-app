const express = require("express");
const router = express.Router();
const { OpenAI, toFile } = require("openai");
const multer = require("multer");
const fs = require("fs");
const os = require("os");
const path = require("path");
const sharp = require("sharp");

// Multer setup (store in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// DALL-E 2 Image Variation endpoint
router.post("/", upload.single("image"), async (req, res) => {
  // Get prompt, image from request
  const { prompt } = req.body; // Prompt is optional for variations
  const uploadedImage = req.file;

  console.log(
    `Received edit-image request: prompt=${prompt}, image=${
      uploadedImage ? "yes" : "no"
    }`
  );

  // Validate that image is provided
  if (!uploadedImage) {
    return res.status(400).json({
      error: "Image is required",
      details: "DALL-E 2 image editing requires an image file",
    });
  }

  try {
    // Log detailed image information
    console.log("Image details:", {
      mimetype: uploadedImage.mimetype,
      size: uploadedImage.size,
      originalname: uploadedImage.originalname || "unknown",
    });

    // Validate image requirements for DALL-E 2
    if (uploadedImage.mimetype !== "image/png") {
      return res.status(400).json({
        error: "Image format invalid",
        details: "DALL-E 2 variations require PNG images",
      });
    }

    if (uploadedImage.size > 4 * 1024 * 1024) {
      return res.status(400).json({
        error: "Image too large",
        details: "DALL-E 2 variations require images smaller than 4MB",
      });
    }

    try {
      // DALL-E 2 Image Edit Request with auto-generated mask
      console.log("Using DALL-E 2 Image Edit with auto-generated mask");

      // Create temp paths
      const tempDir = os.tmpdir();
      const originalTempPath = path.join(tempDir, `original-${Date.now()}.png`);
      const processedTempPath = path.join(
        tempDir,
        `processed-${Date.now()}.png`
      );
      const maskTempPath = path.join(tempDir, `mask-${Date.now()}.png`);

      // Write original buffer to a temporary file
      fs.writeFileSync(originalTempPath, uploadedImage.buffer);

      // Process the image with sharp to ensure it has an alpha channel (RGBA)
      await sharp(originalTempPath)
        .ensureAlpha() // Add alpha channel if missing
        .toFormat("png")
        .toFile(processedTempPath);

      console.log("Image processed to RGBA format");

      // Get image dimensions
      const metadata = await sharp(processedTempPath).metadata();
      const { width, height } = metadata;
      console.log(`Image dimensions: ${width}x${height}`);

      // Create a transparent mask (all white with alpha transparency)
      // This will make the entire image editable by DALL-E
      await sharp({
        create: {
          width: width,
          height: height,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 0 }, // Fully transparent
        },
      })
        .png()
        .toFile(maskTempPath);

      console.log("Created transparent mask for image editing");

      // Use toFile to convert the streams
      const imageStream = fs.createReadStream(processedTempPath);
      const maskStream = fs.createReadStream(maskTempPath);

      const processedImageFile = await toFile(imageStream);
      const maskImageFile = await toFile(maskStream);

      // Make the API request
      console.log("Sending edit request to OpenAI");
      const response = await openai.images.edit({
        image: processedImageFile,
        mask: maskImageFile,
        prompt: prompt || "Transform this image creatively", // Default prompt if none provided
        n: 1,
        size: "1024x1024",
      });

      // Cleanup the temporary files
      try {
        fs.unlinkSync(originalTempPath);
        fs.unlinkSync(processedTempPath);
        fs.unlinkSync(maskTempPath);
      } catch (cleanupError) {
        console.error("Error cleaning up temp files:", cleanupError);
      }

      // Ensure response has expected structure
      if (
        !response ||
        !response.data ||
        !response.data[0] ||
        !response.data[0].url
      ) {
        console.error("Invalid response structure from OpenAI API:", response);
        return res
          .status(500)
          .json({ error: "Invalid response from OpenAI API" });
      }

      const imageUrl = response.data[0].url;
      res.json({ imageUrl });
    } catch (variationError) {
      console.error("Detailed DALL-E 2 error:", variationError);

      // Check for common errors
      if (variationError.message && variationError.message.includes("square")) {
        return res.status(400).json({
          error: "Image must be square",
          details:
            "DALL-E 2 variations require square images (same width and height)",
        });
      }

      // Re-throw for the outer catch block to handle
      throw variationError;
    }
  } catch (err) {
    // Log error information
    console.error("Error processing /edit-image:", err);
    const errorMessage =
      err.response?.data?.error?.message || err.message || "Unknown error";
    const statusCode = err.response?.status || 500;
    res.status(statusCode).json({
      error: "Image editing failed",
      details: errorMessage,
    });
  }
});

module.exports = router;
