import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { CarFront } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Footer() {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <CarFront size={24} />
              <span>Car Tunning AI</span>
            </Link>
            <p className="footer-tagline">
              Transform your ride with our cutting-edge AI technology
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-links-group">
              <h4>Navigation</h4>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/generate">Generate</Link>
                    </li>
                    <li>
                      <Link to="/edit">Edit</Link>
                    </li>
                    <li>
                      <Link to="/creations">My Creations</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/register">Register</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Resources</h4>
              <ul>
                <li>
                  <Link to="/slider">Examples</Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link to="/credits">Credits</Link>
                  </li>
                )}
                <li>
                  <a href="#">Documentation</a>
                </li>
                <li>
                  <a href="#">Tutorials</a>
                </li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-social">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={20} />
          </a>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Car Tunning AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
