import { styles } from "../styles";
import { CarFront } from "lucide-react";

function Home() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.homeLogoContainer}>
        <CarFront size={240} strokeWidth={1} color="red" />
      </div>
      <h1 style={styles.mainHeading}>Car Tunning AI</h1>

      {/* Hero section */}
      <div
        style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto 40px",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            marginBottom: "24px",
            color: "#fff",
          }}
        >
          Transform Your Ride With AI-Powered Car Customization
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.6",
            color: "#e0e0e0",
            marginBottom: "30px",
          }}
        >
          From concept to reality in seconds. Visualize your dream car
          modifications with precision and style using cutting-edge AI
          technology.
        </p>
      </div>

      {/* Features section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        {featureCards.map((feature, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#222",
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "320px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              border: "1px solid #444",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              ":hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "15px",
                color: "#fc0800",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: "1.5",
                color: "#e0e0e0",
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          backgroundColor: "rgba(252, 8, 0, 0.1)",
          borderRadius: "12px",
          marginBottom: "40px",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#fc0800",
          }}
        >
          Ready to Customize Your Car?
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "30px",
            color: "#e0e0e0",
          }}
        >
          Start with a simple image upload and watch as AI transforms your
          vehicle according to your specifications.
        </p>
        <button
          style={{
            ...styles.button,
            ...styles.buttonPrimary,
            padding: "15px 30px",
            fontSize: "1.1rem",
            fontWeight: "700",
          }}
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
}

// Feature cards data
const featureCards = [
  {
    title: "Instant Visualization",
    description:
      "See your modifications in real-time with our advanced AI rendering. No more guessing how modifications will look.",
  },
  {
    title: "Precise Comparisons",
    description:
      "Our interactive slider lets you compare before and after images with precision, helping you make informed decisions.",
  },
  {
    title: "Custom Modifications",
    description:
      "From body kits to paint jobs, wheels to spoilers - customize every aspect of your vehicle's appearance.",
  },
];

export default Home;
