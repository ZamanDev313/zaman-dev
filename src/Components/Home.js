import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaDownload,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Home() {
  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "radial-gradient(circle at center, #1a1f36 0%, #0a0f24 100%)",
        color: "#e6eef8",
        padding: "80px 0",
      }}
    >
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Text Content */}
          <div className="col-lg-7 text-center text-lg-start">
            <h5
              className="text-primary fw-bold mb-3 tracking-widest"
              style={{ letterSpacing: "3px" }}
            >
              WELCOME TO MY PORTFOLIO
            </h5>
            <h1 className="display-2 fw-bold text-white mb-3">
              Hi, I'm <span className="text-primary">Muhammad Zaman</span>
            </h1>
            <h2 className="h1 fw-bold mb-4 opacity-90">
              A Passionate{" "}
              <span className="text-primary border-bottom border-primary border-3">
                Junior Frontend Developer
              </span>
            </h2>
            <p
              className="fs-5 text-secondary mb-5 mx-auto mx-lg-0"
              style={{ maxWidth: "600px", lineHeight: "1.8" }}
            >
              I build responsive, user-friendly websites by turning Figma
              designs into clean, functional interfaces using HTML, CSS,
              JavaScript, and React. I also have hands-on experience with
              WordPress, Shopify, and website QA.
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mb-5">
              <Link
                to="/projects"
                className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center gap-2 text-decoration-none"
              >
                View My Work <FaArrowRight />
              </Link>
              <a
                href="https://drive.google.com/uc?export=download&id=14EazgdMXhtH3hDq0fPCCZ8F4Ph41wxht"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light rounded-pill px-5 py-3 fw-bold d-flex align-items-center gap-2 text-decoration-none"
              >
                Download Resume <FaDownload />
              </a>
            </div>

            <p>Open to Junior Frontend Developer opportunities.</p>
            {/* Social Links */}
            <div className="d-flex gap-4 justify-content-center justify-content-lg-start fs-3">
              <a
                href="https://github.com/Muhammad-zaman313"
                target="_blank"
                rel="noreferrer"
                className="social-icon text-secondary hover-primary"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/muhammad-zaman-rehmani-05b1b42b4/"
                target="_blank"
                rel="noreferrer"
                className="social-icon text-secondary hover-primary"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/zaman_rehmani_313/"
                target="_blank"
                rel="noreferrer"
                className="social-icon text-secondary hover-primary"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=1000852328933"
                target="_blank"
                rel="noreferrer"
                className="social-icon text-secondary hover-primary"
              >
                <FaFacebook />
              </a>
            </div>
          </div>

          {/* Visual Element / Profile Image */}
          <div className="col-lg-5 text-center">
            <div className="hero-img-wrapper position-relative d-inline-block">
              <div
                className="blob-bg position-absolute top-50 start-50 translate-middle"
                style={{
                  width: "120%",
                  height: "120%",
                  background: "rgba(13, 110, 253, 0.15)",
                  filter: "blur(60px)",
                  borderRadius: "50%",
                  zIndex: -1,
                }}
              ></div>
              <div
                className="profile-frame rounded-circle overflow-hidden shadow-lg"
                style={{
                  width: "350px",
                  height: "350px",
                  border: "8px solid rgba(13, 110, 253, 0.1)",
                  padding: "10px",
                }}
              >
                <img
                  src="/myProfileImage.png"
                  alt="Muhammad Zaman"
                  className="img-fluid rounded-circle w-100 h-100 object-fit-cover"
                  style={{ transition: "transform 0.5s ease" }}
                />
              </div>
              {/* Floating Tech Badges */}
              <div
                className="tech-badge position-absolute bg-dark p-3 rounded-circle shadow-lg border border-primary"
                style={{
                  top: "10%",
                  right: "-10%",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                  width="30"
                  alt="React"
                />
              </div>
              <div
                className="tech-badge position-absolute bg-dark p-3 rounded-circle shadow-lg border border-primary"
                style={{
                  bottom: "10%",
                  left: "-10%",
                  animation: "float 3s ease-in-out infinite 1.5s",
                }}
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"
                  width="30"
                  alt="PHP"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .social-icon {
          transition: all 0.3s ease;
        }
        .hover-primary:hover {
          color: #0d6efd !important;
          transform: translateY(-5px);
        }
        .profile-frame:hover img {
          transform: scale(1.1);
        }
        .tracking-widest {
          text-transform: uppercase;
        }
        .btn-primary {
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(13, 110, 253, 0.3) !important;
        }
        .btn-outline-light:hover {
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
}
