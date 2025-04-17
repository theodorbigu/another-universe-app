import { CarFront } from "lucide-react";
import ImageSlider from "../ImageSlider/ImageSlider";
import originalCar from "../../assets/original_car2.png";
import editedCar from "../../assets/edited_car2.png";
import {
  Paintbrush,
  Gauge,
  Sparkles,
  SunMoon,
  Compass,
  Palette,
} from "lucide-react";

function Home() {
  return (
    <div className="page-container">
      {/* Hero section with two columns */}
      <div className="hero-section">
        {/* Left column - Text and CTA */}
        <div className="hero-content">
          <h1>Car Tunning AI</h1>
          <p>
            Transform your ride with our cutting-edge AI technology. From
            concept to reality in seconds, visualize your dream car
            modifications with precision and style.
          </p>
          <button className="button button-primary">Try Now</button>
        </div>

        {/* Right column - Image Slider */}
        <div className="hero-slider">
          <ImageSlider
            beforeImage={originalCar}
            afterImage={editedCar}
            alt="Car tuning comparison"
            size={100}
          />
        </div>
      </div>

      {/* Showcase grid section */}
      <h2 className="section-heading">Explore Modifications</h2>
      <div className="showcase-grid">
        {showcaseItems.map((item, index) => (
          <div key={index} className="showcase-item">
            <ImageSlider
              beforeImage={originalCar}
              afterImage={editedCar}
              alt={item.title}
              size={85}
            />
            <h3 className="showcase-item-title">{item.title}</h3>
            <div className="showcase-item-icon">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Features section */}
      <div className="features-container">
        {featureCards.map((feature, index) => (
          <div key={index} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Showcase items data
const showcaseItems = [
  {
    title: "Custom Paint",
    icon: <Paintbrush size={24} strokeWidth={1.5} />,
  },
  {
    title: "Performance Upgrades",
    icon: <Gauge size={24} strokeWidth={1.5} />,
  },
  {
    title: "Special Effects",
    icon: <Sparkles size={24} strokeWidth={1.5} />,
  },
  {
    title: "Lighting Mods",
    icon: <SunMoon size={24} strokeWidth={1.5} />,
  },
  {
    title: "Aerodynamic Kits",
    icon: <Compass size={24} strokeWidth={1.5} />,
  },
  {
    title: "Color Schemes",
    icon: <Palette size={24} strokeWidth={1.5} />,
  },
];

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
