import { styles } from "../styles";
import ImageSlider from "./ImageSlider";
import originalCar from "../assets/original_car.png";
import editedCar from "../assets/edited_car.png";

function SliderPage() {
  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.subHeading}>Before & After Comparison</h1>

      <div style={{ marginBottom: "40px" }}>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          Slide to compare the original and modified car images. Move the slider
          to the left to see the modified version.
        </p>

        <ImageSlider
          beforeImage={originalCar}
          afterImage={editedCar}
          alt="Car tuning comparison"
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3 style={{ color: "#fc0800", marginBottom: "10px" }}>
            Original Car
          </h3>
          <img
            src={originalCar}
            alt="Original car"
            style={{
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #444",
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3 style={{ color: "#fc0800", marginBottom: "10px" }}>
            Modified Car
          </h3>
          <img
            src={editedCar}
            alt="Modified car"
            style={{
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #444",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SliderPage;
