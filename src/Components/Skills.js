import React from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaBootstrap, FaPhp, FaDatabase, FaGitAlt, FaFileExcel, FaFilePowerpoint } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: [
        { name: "HTML5", icon: <FaHtml5 />, level: "90%", color: "#e34c26" },
        { name: "CSS3", icon: <FaCss3Alt />, level: "85%", color: "#264de4" },
        { name: "JavaScript", icon: <FaJs />, level: "80%", color: "#f7df1e" },
        { name: "ReactJS", icon: <FaReact />, level: "75%", color: "#61dbfb" },
        { name: "Bootstrap", icon: <FaBootstrap />, level: "85%", color: "#7952b3" },
      ],
    },
    {
      title: "Backend & Database",
      skills: [
        { name: "PHP", icon: <FaPhp />, level: "70%", color: "#777bb4" },
        { name: "MySQL", icon: <FaDatabase />, level: "75%", color: "#00758f" },
      ],
    },
    {
      title: "Tools & Others",
      skills: [
        { name: "Git", icon: <FaGitAlt />, level: "70%", color: "#f05032" },
     
        { name: "MS Excel", icon: <FaFileExcel />, level: "80%", color: "#1d6f42" },
        { name: "PowerPoint", icon: <FaFilePowerpoint />, level: "85%", color: "#d24726" },
      ],
    },
  ];

  return (
    <div className="container-fluid py-5" style={{ background: "#1a1f36", color: "#e6eef8", minHeight: "100vh" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="text-primary fw-bold display-4">MY SKILLS</h1>
          <p className="text-light mx-auto fs-5" style={{ maxWidth: "700px" }}>
            Technologies and tools I use to build modern, responsive, and functional web applications.
          </p>
        </div>

        <div className="row g-5">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="col-lg-4">
              <div className="category-card p-4 rounded-4 h-100 shadow-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 className="text-white fw-bold mb-4 border-bottom border-primary pb-2">{category.title}</h3>
                <div className="skills-list">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="skill-item mb-4">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-4" style={{ color: skill.color }}>{skill.icon}</span>
                          <span className="text-white fw-bold">{skill.name}</span>
                        </div>
                        <span className="text-secondary small">{skill.level}</span>
                      </div>
                      <div className="progress bg-dark" style={{ height: "8px", borderRadius: "10px" }}>
                        <div 
                          className="progress-bar progress-bar-striped progress-bar-animated" 
                          role="progressbar" 
                          style={{ width: skill.level, backgroundColor: skill.color, borderRadius: "10px" }}
                          aria-valuenow={parseInt(skill.level)} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Section */}
        <div className="mt-5 pt-5 text-center">
          <div className="p-4 rounded-4 d-inline-block shadow-lg" style={{ background: "rgba(13, 110, 253, 0.1)", border: "1px solid #0d6efd" }}>
            <h4 className="text-white fw-bold mb-2">Currently Learning & Improving</h4>
            <p className="text-light mb-0 opacity-75">Node.js, Express, and Advanced React Patterns</p>
          </div>
        </div>
      </div>

      <style>{`
        .category-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .category-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important;
          border-color: #0d6efd !important;
        }
        .skill-item {
          transition: transform 0.2s ease;
        }
        .skill-item:hover {
          transform: scale(1.02);
        }
        .progress-bar {
          transition: width 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}