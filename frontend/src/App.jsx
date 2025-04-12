import { useState } from "react";
import axios from "axios";
import { styles } from "./styles";

// Basic CSS-in-JS for styling (can be moved to a separate CSS file)

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null); // Result image URL
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Array of {file: File, previewUrl: string}
  const [selectedModel, setSelectedModel] = useState("dall-e-3");
  //const fileInputRef = useRef(null);

  // console.log("uploadedFiles", uploadedFiles);
  // console.log("fileInputRef", fileInputRef);

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
        // Add user feedback if needed
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

  // Function for DALL-E 3 Text-to-Image
  const generateImage = async () => {
    // Validation
    if (!prompt) {
      alert("Prompt is required for DALL-E 3.");
      return;
    }

    setLoading(true);
    setImageUrl(null);

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

  // Function for DALL-E 2 Image Variation
  const editImage = async () => {
    // Validation
    if (uploadedFiles.length === 0) {
      alert("At least one image is required for DALL-E 2.");
      return;
    }

    setLoading(true);
    setImageUrl(null);

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
          },
        }
      );

      setImageUrl(response.data.imageUrl);
      alert("Image variation created successfully!");
    } catch (error) {
      console.error("API call failed:", error.response?.data || error.message);

      const details = error.response?.data?.details || "";
      alert(
        `Image editing failed: ${error.response?.data?.error || error.message}${
          details ? ` - ${details}` : ""
        }`
      );
    }

    setLoading(false);
  };

  // Function to handle the process button click
  const handleProcess = () => {
    if (selectedModel === "dall-e-3") {
      generateImage();
    } else {
      editImage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.vstack}>
        <h1 style={styles.heading}>EditCar AI Image Generator</h1>

        {/* Model Selection */}
        <div style={styles.radioContainer}>
          <h2 style={styles.previewTitle}>Select Model</h2>

          <div
            style={{
              ...styles.radioOption,
              ...(selectedModel === "dall-e-3"
                ? styles.radioOptionSelected
                : styles.radioOptionUnselected),
            }}
            onClick={() => setSelectedModel("dall-e-3")}
          >
            <div>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  id="dall-e-3"
                  name="model"
                  value="dall-e-3"
                  checked={selectedModel === "dall-e-3"}
                  onChange={() => setSelectedModel("dall-e-3")}
                />
                DALL-E 3 (Text-to-Image)
              </label>
              <div style={styles.radioDescription}>
                Generate completely new images from detailed text descriptions.
                <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>
                  Requires a detailed prompt. No image upload needed.
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              ...styles.radioOption,
              ...(selectedModel === "dall-e-2"
                ? styles.radioOptionSelected
                : styles.radioOptionUnselected),
            }}
            onClick={() => setSelectedModel("dall-e-2")}
          >
            <div>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  id="dall-e-2"
                  name="model"
                  value="dall-e-2"
                  checked={selectedModel === "dall-e-2"}
                  onChange={() => setSelectedModel("dall-e-2")}
                />
                DALL-E 2 (Image Editing)
              </label>
              <div style={styles.radioDescription}>
                Create variations of an existing image.
                <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>
                  Requires a PNG image under 4MB. Image must be square.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            {selectedModel === "dall-e-3"
              ? "Prompt (required for text-to-image)"
              : "Prompt (optional for image editing)"}
          </label>
          <textarea
            style={styles.textarea}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              selectedModel === "dall-e-3"
                ? "Enter detailed description of the image you want to generate..."
                : "Optional guidance for image variation..."
            }
            rows="3"
          />
        </div>

        {/* File Upload */}
        <div
          style={{
            ...styles.formGroup,
            opacity: selectedModel === "dall-e-3" ? 0.5 : 1,
            pointerEvents: selectedModel === "dall-e-3" ? "none" : "auto",
          }}
        >
          <label style={styles.label}>
            {selectedModel === "dall-e-2"
              ? "Upload Image (required for DALL-E 2)"
              : "Upload Image (only used with DALL-E 2)"}
          </label>

          <div
            style={styles.fileUpload}
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
            {selectedModel === "dall-e-2" && (
              <p
                style={{
                  fontSize: "0.8rem",
                  marginTop: "8px",
                  color: "#6b7280",
                }}
              >
                Must be PNG format, square (1:1 ratio), and under 4MB
              </p>
            )}
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
          <div style={styles.previewArea}>
            <h3 style={styles.previewTitle}>
              {selectedModel === "dall-e-2"
                ? "Selected Image for Variation:"
                : "Uploaded Images:"}
            </h3>
            <div style={styles.previewWrap}>
              {uploadedFiles.map((fileData, index) => (
                <div key={index} style={styles.previewItem}>
                  <img
                    src={fileData.previewUrl}
                    alt={`Preview ${index}`}
                    style={styles.previewImage}
                  />
                  <button
                    style={styles.removeButton}
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
          style={{
            ...styles.button,
            ...styles.buttonPrimary,
            ...(loading ? styles.buttonDisabled : {}),
            width: "100%",
            marginTop: "8px",
          }}
          onClick={handleProcess}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : selectedModel === "dall-e-3"
            ? "Generate New Image"
            : "Create Image Variation"}
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
            <div style={styles.resultTitle}>
              Generated {selectedModel === "dall-e-3" ? "Image" : "Variation"}:
            </div>
            <img
              src={imageUrl}
              alt="AI Generated Result"
              style={styles.resultImage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
