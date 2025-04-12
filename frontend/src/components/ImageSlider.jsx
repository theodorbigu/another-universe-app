import { useState, useRef } from "react";
import { styles } from "../styles";

const ImageSlider = ({ beforeImage, afterImage, alt = "Image comparison" }) => {
  const [sliderPosition, setSliderPosition] = useState(100); // 100% means showing only "before" image
  const sliderContainerRef = useRef(null);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  // Calculate the width of the "after" image based on slider position
  const afterImageStyle = {
    width: `${sliderPosition}%`,
  };

  return (
    <div
      style={{
        ...styles.sliderContainer,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Container for both images */}
      <div
        ref={sliderContainerRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9", // maintain a consistent aspect ratio
        }}
      >
        {/* After image (visible based on slider) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <img
            src={afterImage}
            alt={`${alt} (after)`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Before image with dynamic width */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            ...afterImageStyle,
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          <img
            src={beforeImage}
            alt={`${alt} (before)`}
            style={{
              width: `${100 / (sliderPosition / 100)}%`, // Scale the image based on visible portion
              height: "100%",
              objectFit: "cover",
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

      {/* Slider control */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        style={{
          width: "100%",
          margin: "20px 0",
          accentColor: "#fc0800",
        }}
      />
    </div>
  );
};

export default ImageSlider;
