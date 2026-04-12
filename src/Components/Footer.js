import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

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

      <style>{`
        .footer {
          background: linear-gradient(135deg, #0a0f24, #1a1f36);
          padding: 60px 20px;
          border-top:0.5px solid #576b8f;
          position: relative;
          overflow: hidden;
        }

        /* Glow background effect */
        .footer::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(93,99,241,0.4), transparent);
          top: -100px;
          left: -100px;
          filter: blur(80px);
        }

        .footer-title {
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 10px;
          color: #ffffff;
        }

        .footer-subtitle {
          color: #aab4d4;
          margin-bottom: 30px;
          font-size: 1rem;
        }

        .social-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1.3rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        /* Hover effect */
        .icon:hover {
          transform: translateY(-8px) scale(1.1);
          color: #5d63f1;
          box-shadow: 0 0 20px rgba(93, 99, 241, 0.6);
          border-color: #5d63f1;
        }

        .footer-copy {
          font-size: 0.9rem;
          color: #8892b0;
        }

        /* Responsive */
        @media (max-width: 576px) {
          .footer-title {
            font-size: 1.5rem;
          }

          .icon {
            width: 45px;
            height: 45px;
          }
        }
      `}</style>
    </>
  );
}