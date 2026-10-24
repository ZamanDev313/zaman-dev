import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import "../../styles/Components/Portfolio/Footer.css";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container text-center">

          {/* Heading */}
          <h2 className="footer-title">Let's Connect</h2>
          <p className="footer-subtitle">
            Building • Learning • Growing 🚀
          </p>

          {/* Social Icons */}
          <div className="social-container">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="icon">
              <FaFacebook />
            </a>

            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="icon">
              <FaLinkedin />
            </a>

            <a href="https://github.com/Muhammad-zaman313" target="_blank" rel="noreferrer" className="icon">
              <FaGithub />
            </a>

            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="icon">
              <FaInstagram />
            </a>
          </div>

          {/* Bottom Text */}
          <p className="footer-copy">
            © {new Date().getFullYear()} Muhammad Zaman. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}