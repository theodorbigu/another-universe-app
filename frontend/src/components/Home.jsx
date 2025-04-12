import { styles } from "../styles";
import logoImg from "../assets/car-tunning-logo-red.png";

function Home() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.homeLogoContainer}>
        <img src={logoImg} alt="Car Tunning AI Logo" style={styles.homeLogo} />
      </div>
      <h1 style={styles.mainHeading}>Car Tunning AI</h1>
    </div>
  );
}

export default Home;
