import React from "react";
import { FaCode, FaLightbulb, FaRocket, FaUserGraduate, FaDatabase } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function About() {
  return (
    <div className="container-fluid py-5" style={{ background: "#1a1f36", color: "#e6eef8", minHeight: "100vh" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="text-primary fw-bold display-4">ABOUT ME</h1>
          <p className="text-light mx-auto fs-5" style={{ maxWidth: "700px" }}>
            My journey from a curious student to a passionate Full-Stack Developer.
          </p>
        </div>

        <div className="row align-items-center g-5">
          {/* Image Section */}
          <div className="col-lg-5 text-center">
            <div className="position-relative d-inline-block">
              <div className="profile-img-container rounded-4 overflow-hidden shadow-lg" style={{ border: "4px solid #0d6efd" }}>
                <img 
                  src="/myprofileimage.jpeg"
                  alt="Muhammad Zaman" 
                  className="img-fluid" 
                  style={{ maxWidth: "350px", height: "450px", objectFit: "cover", transition: "transform 0.5s ease" }}
                />
              </div>
              <div className="experience-badge position-absolute bg-primary text-white p-3 rounded-3 shadow-lg" style={{ bottom: "-20px", right: "-20px" }}>
                <h4 className="fw-bold mb-0">BSCS</h4>
                <p className="small mb-0">Final Year Student</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="col-lg-7">
            <h2 className="text-white fw-bold mb-4">Hello! I'm <span className="text-primary">Muhammad Zaman</span></h2>
            <p className="fs-5 opacity-75 mb-4">
              I am a final-semester Computer Science student at Federal Urdu University, Karachi. My passion lies in crafting clean, responsive, and user-centric web experiences.
            </p>
            
            <div className="story-box p-4 rounded-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", borderLeft: "5px solid #0d6efd" }}>
              <p className="mb-0 italic">
                "My real breakthrough happened during my NAVTTC training. Integrating PHP and MySQL for the first time was a challenge that turned into my biggest motivation. That moment of successfully connecting a database taught me that with persistence, any technical hurdle can be overcome."
              </p>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="text-primary fs-3"><FaCode /></div>
                  <div>
                    <h5 className="text-white fw-bold mb-1">Frontend Expert</h5>
                    <p className="small text-secondary">Specializing in React, JavaScript, and Bootstrap for modern UIs.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="text-primary fs-3"><FaDatabase /></div>
                  <div>
                    <h5 className="text-white fw-bold mb-1">Backend Learner</h5>
                    <p className="small text-secondary">Hands-on experience with PHP and MySQL for dynamic systems.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="text-primary fs-3"><FaLightbulb /></div>
                  <div>
                    <h5 className="text-white fw-bold mb-1">Problem Solver</h5>
                    <p className="small text-secondary">Enjoy tackling complex logic and finding efficient solutions.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="text-primary fs-3"><FaRocket /></div>
                  <div>
                    <h5 className="text-white fw-bold mb-1">Future Goal</h5>
                    <p className="small text-secondary">Aiming to become a Full-Stack Developer and build impactful products.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <a href="#contact" className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-lg">Hire Me</a>
              <a href="/resume.html" target="_blank" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold">View Resume</a>
            </div>
          </div>
        </div>

        {/* Education Timeline Preview */}
        <div className="mt-5 pt-5">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-4 rounded-4 h-100 shadow-sm" style={{ background: "rgba(255,255,255,0.02)" }}>
                <FaUserGraduate className="text-primary fs-1 mb-3" />
                <h4 className="text-white fw-bold">BSCS</h4>
                <p className="text-secondary mb-0">Expected Dec 2026</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4 h-100 shadow-sm" style={{ background: "rgba(255,255,255,0.02)" }}>
                <FaCode className="text-primary fs-1 mb-3" />
                <h4 className="text-white fw-bold">NAVTTC</h4>
                <p className="text-secondary mb-0">Web Development Cert.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4 h-100 shadow-sm" style={{ background: "rgba(255,255,255,0.02)" }}>
                <FaRocket className="text-primary fs-1 mb-3" />
                <h4 className="text-white fw-bold">Projects</h4>
                <p className="text-secondary mb-0">3+ Real-world Apps</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-img-container:hover img {
          transform: scale(1.05);
        }
        .story-box {
          transition: all 0.3s ease;
        }
        .story-box:hover {
          background: rgba(255,255,255,0.05) !important;
          transform: translateX(5px);
        }
        .italic {
          font-style: italic;
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
}