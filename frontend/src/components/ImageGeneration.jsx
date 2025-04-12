import { useState } from "react";
import axios from "axios";
import { styles } from "../styles";
import { saveCreation } from "../services/api";

function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const generateImage = async () => {
    // Validation
    if (!prompt) {
      alert("Prompt is required for DALL-E 3.");
      return;
    }

    setLoading(true);
    setImageUrl(null);
    setSaveSuccess(false);

    try {
      // Send request to generate-image endpoint using JSON
      const response = await axios.post(
        "http://localhost:5001/generate-image",
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setImageUrl(response.data.imageUrl);
      alert("Image generated successfully!");
    } catch (error) {
      console.error("API call failed:", error.response?.data || error.message);

      const details = error.response?.data?.details || "";
      alert(
        `Image generation failed: ${
          error.response?.data?.error || error.message
        }${details ? ` - ${details}` : ""}`
      );
    }

    setLoading(false);
  };

  const handleSaveCreation = async () => {
    if (!imageUrl || !prompt) {
      alert("Both image and prompt are required to save to gallery.");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      await saveCreation(prompt, imageUrl);
      setSaveSuccess(true);
      alert("Creation saved to gallery successfully!");
    } catch (error) {
      console.error("Failed to save creation:", error);
      alert(
        `Failed to save to gallery: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.subHeading}>Image Generation with DALL-E 3</h1>

      {/* Prompt Input */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Prompt (required for text-to-image)</label>
        <textarea
          style={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter detailed description of the image you want to generate..."
          rows="3"
        />
      </div>

      {/* Process Button */}
      <button
        style={{
          ...styles.button,
          ...styles.buttonPrimary,
          ...(loading ? styles.buttonDisabled : {}),
          width: "100%",
          marginTop: "8px",
        }}
        onClick={generateImage}
        disabled={loading}
      >
        {loading ? "Processing..." : "Generate New Image"}
      </button>

      {/* Loading Indicator */}
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>Processing your request. This may take a moment...</p>
        </div>
      )}

      {/* Result Image Area */}
      {imageUrl && !loading && (
        <div style={styles.resultArea}>
          <div style={styles.resultTitle}>Generated Image:</div>
          <img
            src={imageUrl}
            alt="AI Generated Result"
            style={styles.resultImage}
          />

          {/* Save to Gallery Button */}
          <button
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              ...(saving ? styles.buttonDisabled : {}),
              ...(saveSuccess ? styles.buttonSuccess : {}),
              marginTop: "16px",
            }}
            onClick={handleSaveCreation}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : saveSuccess
              ? "Saved to Gallery!"
              : "Save to Gallery"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageGeneration;
