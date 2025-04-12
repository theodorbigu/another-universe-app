import { useState, useRef, useEffect } from "react";
import { styles } from "../styles";
import { MoveHorizontal } from "lucide-react";

const ImageSlider = ({
  beforeImage,
  afterImage,
  alt = "Image comparison",
  size = 100, // Default to 100% width of parent container
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // Start at 50% to show half of each
  const [imageRatio, setImageRatio] = useState(1); // Default 1:1 ratio
  const sliderContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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

  // Handle drag events for the slider handle
  const startDrag = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  const onDrag = (e) => {
    if (isDragging && sliderContainerRef.current) {
      const containerRect = sliderContainerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;

      // Calculate position based on mouse/touch position relative to container
      let newPos;
      if (e.type === "touchmove") {
        newPos =
          ((e.touches[0].clientX - containerRect.left) / containerWidth) * 100;
      } else {
        newPos = ((e.clientX - containerRect.left) / containerWidth) * 100;
      }

      // Clamp values to valid range
      newPos = Math.max(0, Math.min(100, newPos));
      setSliderPosition(newPos);
    }
  };

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("touchmove", onDrag);
      window.addEventListener("mouseup", endDrag);
      window.addEventListener("touchend", endDrag);
    }

    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchend", endDrag);
    };
  }, [isDragging]);

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
          cursor: isDragging ? "ew-resize" : "grab",
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
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
            backgroundColor: "#333333",
            zIndex: 3,
          }}
        />

        {/* Draggable handle in the middle of the line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${sliderPosition}%`,
            transform: `translate(-50%, -50%) ${
              isHovering
                ? "scale(1.1)"
                : isDragging
                ? "scale(1.15)"
                : "scale(1)"
            }`,
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "rgb(51, 51, 51)",
            border: "none",
            boxShadow: isDragging
              ? "0 4px 8px rgba(51, 51, 51, 0.7), 0 0 12px rgba(51, 51, 51, 0.7)"
              : isHovering
              ? "0 0 5px rgba(0, 0, 0, 0.5), 0 0 8px rgba(51, 51, 51, 0.5)"
              : "0 0 5px rgba(0, 0, 0, 0.5)",
            zIndex: 4,
            cursor: isDragging ? "ew-resize" : "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Arrow indicators */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              justifyContent: "space-between",
              // width: "12px",
              opacity: isHovering || isDragging ? 1 : 0.8,
              transition: "opacity 0.2s ease",
            }}
          >
            <MoveHorizontal
              size={20}
              strokeWidth={1}
              color={isHovering || isDragging ? "white" : "#e0e0e0"}
            />
          </div>
        </div>

        {/* Invisible range input positioned over the image */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            // width: "100%",
            margin: 0,
            accentColor: "transparent",
            opacity: 0, // Make it invisible
            zIndex: 5, // Higher than the handle to capture events
            cursor: "pointer",
            height: "40px", // Taller hit area for easier interaction
          }}
        />
      </div>
    </div>
  );
};

export default ImageSlider;
