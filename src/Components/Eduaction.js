import React from "react";
import { FaUserGraduate, FaSchool, FaBook, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Eduaction() {
  const educationData = [
    {
      id: 1,
      degree: "Bachelor of Computer Science (BSCS)",
      institution: "Federal Urdu University of Arts, Science & Technology, Karachi",
      duration: "2020 - Expected Dec 2026",
      location: "Karachi, Pakistan",
      description: "Currently in my final semester, focusing on Full-Stack Web Development. Gained strong foundations in Data Structures, Algorithms, and Database Management Systems.",
      icon: <FaUserGraduate />,
      status: "In Progress"
    },
    {
      id: 2,
      degree: "Intermediate (Pre-Engineering)",
      institution: "Millat Public Higher Secondary School",
      duration: "2018 - 2020",
      location: "Karachi, Pakistan",
      description: "Completed higher secondary education with a focus on Mathematics, Physics, and Computer Science, building a strong analytical foundation.",
      icon: <FaSchool />,
      status: "Completed"
    },
    {
      id: 3,
      degree: "Matriculation (Science)",
      institution: "Millat Public Higher Secondary School & College",
      duration: "2016 - 2018",
      location: "Karachi, Pakistan",
      description: "Studied core science subjects including Mathematics and Computer Studies, sparking my initial interest in technology.",
      icon: <FaBook />,
      status: "Completed"
    }
  ];

  return (
    <div className="container-fluid py-5" style={{ background: "#1a1f36", color: "#e6eef8", minHeight: "100vh" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="text-primary fw-bold display-4">MY EDUCATION</h1>
          <p className="text-light mx-auto fs-5" style={{ maxWidth: "700px" }}>
            My academic journey, milestones, and the foundation of my technical expertise.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="timeline position-relative">
              {/* Vertical Line */}
              <div className="timeline-line position-absolute start-50 translate-middle-x h-100 bg-primary opacity-25 d-none d-md-block" style={{ width: "4px", top: 0 }}></div>

              {educationData.map((edu, index) => (
                <div key={edu.id} className={`timeline-item mb-5 position-relative d-flex flex-column ${index % 2 === 0 ? 'align-items-md-start' : 'align-items-md-end'}`}>
                  {/* Timeline Dot */}
                  <div className="timeline-dot position-absolute start-50 translate-middle bg-primary rounded-circle shadow-lg d-none d-md-flex align-items-center justify-content-center text-white fs-5" 
                       style={{ width: "50px", height: "50px", zIndex: 10, top: "20px" }}>
                    {edu.icon}
                  </div>

                  {/* Content Card */}
                  <div className={`education-card p-4 rounded-4 shadow-lg w-100 w-md-45 ${index % 2 === 0 ? 'text-md-end' : 'text-md-start'}`} 
                       style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s ease" }}>
                    <div className={`d-flex align-items-center gap-2 mb-2 justify-content-center ${index % 2 === 0 ? 'justify-content-md-end' : 'justify-content-md-start'}`}>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill small fw-bold">
                        {edu.status}
                      </span>
                    </div>
                    <h3 className="text-white fw-bold mb-2">{edu.degree}</h3>
                    <h5 className="text-primary mb-3">{edu.institution}</h5>
                    
                    <div className={`d-flex flex-wrap gap-3 mb-3 justify-content-center ${index % 2 === 0 ? 'justify-content-md-end' : 'justify-content-md-start'}`}>
                      <span className="text-secondary small d-flex align-items-center gap-1">
                        <FaCalendarAlt /> {edu.duration}
                      </span>
                      <span className="text-secondary small d-flex align-items-center gap-1">
                        <FaMapMarkerAlt /> {edu.location}
                      </span>
                    </div>
                    
                    <p className="text-light opacity-75 mb-0" style={{ lineHeight: "1.7" }}>
                      {edu.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .w-md-45 { width: 45% !important; }
          .timeline-item:nth-child(even) .education-card {
            margin-left: auto;
          }
        }
        .education-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.06) !important;
          border-color: #0d6efd !important;
          box-shadow: 0 15px 30px rgba(0,0,0,0.4) !important;
        }
        .timeline-dot {
          transition: all 0.3s ease;
        }
        .timeline-item:hover .timeline-dot {
          transform: translate(-50%, -50%) scale(1.2) !important;
          box-shadow: 0 0 20px rgba(13, 110, 253, 0.5) !important;
        }
      `}</style>
    </div>
  );
}