import { useState, useEffect } from "react";
import axios from "axios";
import ImageSlider from "../ImageSlider/ImageSlider";
import { useAuth } from "../../context/AuthContext";

function ImageEditing() {
  const { token } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [credits, setCredits] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch user's credits
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/credits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCredits(response.data.credits);
      } catch (err) {
        console.error("Failed to fetch credits:", err);
      }
    };

    if (token) {
      fetchCredits();
    }
  }, [token]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const newFilesData = [];
    let readCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newFilesData.push({ file: file, previewUrl: reader.result });
        readCount++;
        if (readCount === files.length) {
          setUploadedFiles((prevFiles) => [...prevFiles, ...newFilesData]);
        }
      };
      reader.onerror = () => {
        console.error("Error reading file:", file.name);
        readCount++;
        if (readCount === files.length) {
          setUploadedFiles((prevFiles) => [...prevFiles, ...newFilesData]);
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = null;
  };

  const removeFile = (indexToRemove) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const editImage = async () => {
    // Validation
    if (uploadedFiles.length === 0) {
      alert("At least one image is required for DALL-E 2.");
      return;
    }

    // Credit check
    if (credits !== null && credits < 1) {
      alert(
        "You don't have enough credits to edit images. Please purchase more credits."
      );
      return;
    }

    setLoading(true);
    setImageUrl(null);
    setErrorMessage(null);

    try {
      // Send request to edit-image endpoint using FormData
      const formData = new FormData();
      formData.append("prompt", prompt); // Prompt is optional for variations
      formData.append("image", uploadedFiles[0].file);

      const response = await axios.post(
        "http://localhost:5001/edit-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update credits after successful edit
      setCredits((prev) => prev - 1);

      setImageUrl(response.data.imageUrl);
      alert("Image variation created successfully!");
    } catch (error) {
      console.error("API call failed:", error.response?.data || error.message);

      const details = error.response?.data?.details || "";

      // Special handling for credit-related errors
      if (
        error.response?.status === 403 &&
        error.response?.data?.error === "Insufficient credits"
      ) {
        setCredits(error.response.data.credits); // Update credits display with server value
        setErrorMessage(
          `You need ${error.response.data.required} credits to edit images, but you only have ${error.response.data.credits} credits.`
        );
      } else {
        setErrorMessage(
          `Image editing failed: ${
            error.response?.data?.error || error.message
          }${details ? ` - ${details}` : ""}`
        );
      }
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1 className="sub-heading">Image Editing with DALL-E 2</h1>

      {/* Error message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Prompt Input */}
      <div className="form-group">
        <label className="label">Prompt (optional for image editing)</label>
        <textarea
          className="textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Optional guidance for image variation..."
          rows="3"
        />
      </div>

      {/* File Upload */}
      <div className="form-group">
        <label className="label">Upload Image (required for DALL-E 2)</label>

        <div
          className="file-upload"
          onClick={() => document.getElementById("file-upload").click()}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: "0 auto 12px" }}
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>

          <div>
            {uploadedFiles.length
              ? `${uploadedFiles.length} file selected`
              : "Click to select a PNG image"}
          </div>
          <p
            style={{
              fontSize: "0.8rem",
              marginTop: "8px",
              color: "#6b7280",
            }}
          >
            Must be PNG format, square (1:1 ratio), and under 4MB
          </p>
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/png"
          />
        </div>
      </div>

      {/* Image Preview Area */}
      {uploadedFiles.length > 0 && (
        <div className="preview-area">
          <h3 className="preview-title">Selected Image for Variation:</h3>
          <div className="preview-wrap">
            {uploadedFiles.map((fileData, index) => (
              <div key={index} className="preview-item">
                <img
                  src={fileData.previewUrl}
                  alt={`Preview ${index}`}
                  className="preview-image"
                />
                <button
                  className="remove-button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove image ${index + 1}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Button */}
      <button
        className={`button button-primary ${loading ? "button-disabled" : ""}`}
        style={{
          width: "100%",
          marginTop: "8px",
        }}
        onClick={editImage}
        disabled={loading}
      >
        {loading ? "Processing..." : "Create Image Variation"}
      </button>

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Processing your request. This may take a moment...</p>
        </div>
      )}

      {/* Result Area - replaced with ImageSlider */}
      {imageUrl && !loading && uploadedFiles.length > 0 && (
        <ImageSlider
          beforeImage={uploadedFiles[0].previewUrl}
          afterImage={imageUrl}
          alt="Before and after image comparison"
          size={70} // 90% width of container
        />
      )}
    </div>
  );
}

export default ImageEditing;
