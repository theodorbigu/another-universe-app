import { useState, useRef, useEffect } from "react";
import { styles } from "../styles";

const ImageSlider = ({
  beforeImage,
  afterImage,
  alt = "Image comparison",
  size = 100, // Default to 100% width of parent container
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // Start at 50% to show half of each
  const [imageRatio, setImageRatio] = useState(1); // Default 1:1 ratio
  const sliderContainerRef = useRef(null);

  // Preload images to get their natural dimensions
  useEffect(() => {
    const preloadImages = () => {
      const beforeImg = new Image();
      beforeImg.src = beforeImage;

      beforeImg.onload = () => {
        // Calculate aspect ratio from the actual image
        const ratio = beforeImg.naturalHeight / beforeImg.naturalWidth;
        setImageRatio(ratio);
      };
    };

    preloadImages();
  }, [beforeImage]);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  // Calculate container styles based on the size prop
  const containerStyles = {
    ...styles.sliderContainer,
    position: "relative",
    width: `${size}%`, // Use size prop to control width
    maxWidth: size < 100 ? "none" : "800px", // Only apply max-width if size is 100%
    margin: "0 auto",
  };

  return (
    <div style={containerStyles}>
      {/* Container for both images */}
      <div
        ref={sliderContainerRef}
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: `${imageRatio * 100}%`, // Dynamic padding based on image ratio
          backgroundColor: "#222",
        }}
      >
        {/* After image (edited car) - base layer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          <img
            src={afterImage}
            alt={`${alt} (after)`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // Show full image without cropping
              backgroundColor: "#222",
            }}
          />
        </div>

        {/* Before image (original car) with reveal mask */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, // Clip from right side based on slider
          }}
        >
          <img
            src={beforeImage}
            alt={`${alt} (before)`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // Show full image without cropping
              backgroundColor: "#222",
            }}
          />
        </div>

        {/* Slider divider line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: "2px",
            backgroundColor: "#fc0800",
            zIndex: 3,
          }}
        />
      </div>

      {/* Slider controls */}
      <div style={{ width: "100%", padding: "10px 0" }}>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          style={{
            width: "100%",
            margin: "10px 0",
            accentColor: "#fc0800",
          }}
        />
      </div>
    </div>
  );
};

export default ImageSlider;
