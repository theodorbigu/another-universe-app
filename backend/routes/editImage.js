const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const multer = require("multer");
const fs = require("fs");
const os = require("os");
const path = require("path");
const sharp = require("sharp");
const FormData = require("form-data");
const axios = require("axios");
const { verifyToken } = require("../middleware/auth");
const supabase = require("../supabaseClient");

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

// Helper function to create File objects from file paths
async function createFileObject(filePath, fileName, mimeType) {
  const buffer = fs.readFileSync(filePath);

  // For Node.js environments where File might not be available
  if (typeof File === "undefined") {
    // Create a form data friendly object with proper mime type
    return {
      data: buffer,
      name: fileName,
      type: mimeType,
    };
  } else {
    // Browser or environments with File constructor
    return new File([buffer], fileName, { type: mimeType });
  }
}

// DALL-E 2 Image Variation endpoint
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.uid;

    // Check current credit balance
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("uid", userId)
      .single();

    if (userError) {
      console.error("Error fetching user credits:", userError);
      return res.status(500).json({
        error: "Failed to verify credit balance",
        details: "Please try again later",
      });
    }

    // Define credit cost
    const EDIT_COST = 1; // Each edit costs 1 credit

    // Check if user has enough credits
    if (userData.credits < EDIT_COST) {
      return res.status(403).json({
        error: "Insufficient credits",
        credits: userData.credits,
        required: EDIT_COST,
        details: "Please purchase more credits to continue",
      });
    }

    // Deduct credits
    try {
      const creditResponse = await axios.post(
        `${
          process.env.API_BASE_URL || "http://localhost:5001"
        }/api/credits/use`,
        {
          amount: EDIT_COST,
          description: "Image editing with DALL-E 2",
        },
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );

      if (!creditResponse.data.success) {
        return res.status(403).json({
          error: "Credit deduction failed",
          details: "Please try again later",
        });
      }
    } catch (creditError) {
      console.error("Error deducting credits:", creditError);
      return res.status(500).json({
        error: "Failed to process credits",
        details: "Please try again later",
      });
    }

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
        // DALL-E 2 Image Edit Request with pre-existing mask
        console.log("Using DALL-E 2 Image Edit with pre-existing mask");

        // Create temp paths
        const tempDir = os.tmpdir();
        const originalTempPath = path.join(
          tempDir,
          `original-${Date.now()}.png`
        );
        const processedTempPath = path.join(
          tempDir,
          `processed-${Date.now()}.png`
        );

        // Path to the pre-existing mask file
        const maskPath = path.join(__dirname, "../images/test2/mask2.png");

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

        // Using pre-existing mask from images directory
        console.log("Using pre-existing mask from images directory");

        // Create form data with proper mime types
        const form = new FormData();
        form.append("prompt", prompt || "Transform this image creatively");
        form.append("n", "1");
        form.append("size", "1024x1024");

        // Append files with correct mime types
        form.append("image", fs.createReadStream(processedTempPath), {
          filename: "image.png",
          contentType: "image/png",
        });

        form.append("mask", fs.createReadStream(maskPath), {
          filename: "mask.png",
          contentType: "image/png",
        });

        // Make API request with axios
        console.log("Sending edit request to OpenAI");
        const response = await axios.post(
          "https://api.openai.com/v1/images/edits",
          form,
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              ...form.getHeaders(),
            },
          }
        );

        // Cleanup the temporary files
        try {
          fs.unlinkSync(originalTempPath);
          fs.unlinkSync(processedTempPath);
        } catch (cleanupError) {
          console.error("Error cleaning up temp files:", cleanupError);
        }

        // Ensure response has expected structure
        if (
          !response.data ||
          !response.data.data ||
          !response.data.data[0] ||
          !response.data.data[0].url
        ) {
          console.error(
            "Invalid response structure from OpenAI API:",
            response.data
          );
          return res
            .status(500)
            .json({ error: "Invalid response from OpenAI API" });
        }

        const imageUrl = response.data.data[0].url;
        res.json({ imageUrl });
      } catch (variationError) {
        console.error("Detailed DALL-E 2 error:", variationError);

        // Check for common errors
        if (
          variationError.message &&
          variationError.message.includes("square")
        ) {
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
