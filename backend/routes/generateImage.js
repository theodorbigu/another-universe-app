const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// DALL-E 3 Text-to-Image endpoint
router.post("/", async (req, res) => {
  // Get prompt from body
  const { prompt } = req.body;

  console.log(`Received generate-image request: prompt=${prompt}`);

  if (!prompt) {
    return res.status(400).json({
      error: "Prompt is required",
      details: "DALL-E 3 generation requires a text prompt",
    });
  }

  try {
    // DALL-E 3 Text-to-Image Request
    console.log("Using DALL-E 3 Text-to-Image");

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

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
  } catch (err) {
    // Log error information
    console.error("Error processing /generate-image:", err);
    const errorMessage =
      err.response?.data?.error?.message || err.message || "Unknown error";
    const statusCode = err.response?.status || 500;
    res.status(statusCode).json({
      error: "Image generation failed",
      details: errorMessage,
    });
  }
});

module.exports = router;
