import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useState } from "react";
import { FaTimes, FaLaptopCode, FaMobileAlt, FaDatabase, FaGlobe, FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export default function Projects() {
  const defaultProjects = [
    {
      id: 1,
      title: "Future Genius Academy Management System",
      img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop",
      desc: "A full-stack academy management system with database integration and admin panel. This was my NAVTTC final project where I successfully integrated PHP and MySQL for the first time.",
      challenge: "The biggest challenge was connecting the database with PHP for the first time. Overcoming this gave me a deep understanding of backend integration.",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      codeLink: "https://github.com/Muhammad-zaman313/Website-Projects",
      liveLink: "#",
      icon: <FaDatabase />,
    },
    {
      id: 2,
      title: "E-library Website",
      img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop",
      desc: "A digital platform for students to access and download academic resources easily. Focused on clean UI and easy navigation.",
      challenge: "Designed a user-friendly interface to manage a large collection of digital resources efficiently.",
      tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      codeLink: "https://github.com/Muhammad-zaman313/Website-Projects",
      liveLink: "#",
      icon: <FaGlobe />,
    },
    {
      id: 3,
      title: "React Portfolio Website",
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
      desc: "My personal portfolio built with React to showcase my skills and projects with a modern, responsive design.",
      challenge: "Implemented dynamic components and smooth animations using React and Bootstrap.",
      tech: ["React", "Bootstrap", "CSS Animations", "JavaScript"],
      codeLink: "https://github.com/Muhammad-zaman313/zaman-react-portfolio",
      liveLink: "https://zaman-react-portfolio.vercel.app/",
      icon: <FaLaptopCode />,
    },
  ];

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : defaultProjects;
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    img: "",
    desc: "",
    codeLink: "",
    liveLink: "",
    icon: "FaLaptopCode",
  });

  const iconOptions = {
    FaLaptopCode: <FaLaptopCode />,
    FaMobileAlt: <FaMobileAlt />,
    FaDatabase: <FaDatabase />,
    FaGlobe: <FaGlobe />,
  };

  const addProject = () => {
    const { title, img,  } = formData;
    if (!title || !img) {
      alert("Title and Image URL are required!");
      return;
    }

    const newProjects = [
      ...projects,
      { id: Date.now(), ...formData, icon: iconOptions[formData.icon] || <FaLaptopCode /> },
    ];
    setProjects(newProjects);
    localStorage.setItem("projects", JSON.stringify(newProjects));

    setFormData({ title: "", img: "", desc: "", codeLink: "", liveLink: "", icon: "FaLaptopCode" });
    setShowModal(false);
  };

  const removeProject = (id, e) => {
    e.stopPropagation();
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    localStorage.setItem("projects", JSON.stringify(newProjects));
  };

  return (
    <div className="container-fluid py-5" style={{ background: "#1a1f36", color: "#e6eef8", minHeight: "100vh" }}>
      <div className="text-center mb-5">
        <h1 className="text-primary fw-bold display-4">MY PROJECTS</h1>
        <p className="text-light mx-auto fs-5" style={{ maxWidth: "700px" }}>
          A showcase of my technical journey, from frontend designs to full-stack integrations.
        </p>
      </div>

      {/* Floating Add Button */}
      {/* <button
        className="btn btn-primary rounded-circle position-fixed shadow-lg"
        style={{ bottom: "40px", right: "40px", width: "60px", height: "60px", fontSize: "1.5rem", zIndex: 1000 }}
        onClick={() => setShowModal(true)}
        title="Add New Project"
      >
        <FaPlus />
      </button> */}

      {/* Projects Grid */}
      <div className="container">
        <div className="row justify-content-center g-4">
          {projects.map(project => (
            <div key={project.id} className="col-lg-4 col-md-6">
              <div 
                className="project-card position-relative rounded-4 overflow-hidden shadow-lg bg-dark"
                onClick={() => setSelectedProject(project)}
              >
                <div className="img-container" style={{ height: "250px", overflow: "hidden" }}>
                  <img src={project.img} alt={project.title} className="img-fluid w-100 h-100 object-fit-cover" />
                </div>
                <div className="p-4">
                  <div className="d-flex align-items-center mb-2">
                    <span className="text-primary me-2 fs-4">{project.icon}</span>
                    <h5 className="text-white fw-bold mb-0 text-truncate">{project.title}</h5>
                  </div>
                  <p className="text-secondary small mb-3 text-truncate-2">{project.desc}</p>
                  <div className="d-flex gap-2">
                    {project.tech && project.tech.slice(0, 3).map((t, i) => (
                      <span key={i} className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="overlay d-flex flex-column justify-content-center align-items-center text-center p-3">
                  <h5 className="text-white fw-bold mb-3">View Details</h5>
                  <button className="btn btn-primary rounded-pill px-4">Learn More</button>
                  <button 
                    className="btn btn-sm btn-outline-danger mt-3 border-0" 
                    onClick={(e) => removeProject(project.id, e)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-content  p-0 rounded-4 border-0 shadow-2xl overflow-hidden " 
               style={{ maxWidth: "800px", width: "80%", background: "#131738" }}
               onClick={e => e.stopPropagation()}>
            <div className="position-relative">
              <img src={selectedProject.img} alt={selectedProject.title} className="w-100" style={{ maxHeight: "350px", objectFit: "cover" }} />
              <button className="btn btn-dark rounded-circle position-absolute top-0 end-0 m-3 opacity-75" onClick={() => setSelectedProject(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="p-4 p-md-5">
              <div className="d-flex align-items-center mb-3">
                <span className="text-primary me-3 fs-2">{selectedProject.icon}</span>
                <h2 className="text-white fw-bold mb-0">{selectedProject.title}</h2>
              </div>
              
              <div className="mb-4">
                <h6 className="text-primary text-uppercase fw-bold small mb-2">Description</h6>
                <p className="text-light fs-5 opacity-75">{selectedProject.desc}</p>
              </div>

              {selectedProject.challenge && (
                <div className="mb-4 p-3 rounded-3" style={{ background: "rgba(13, 110, 253, 0.1)", borderLeft: "4px solid #0d6efd" }}>
                  <h6 className="text-primary text-uppercase fw-bold small mb-2">Key Challenge & Learning</h6>
                  <p className="text-light mb-0 italic">"{selectedProject.challenge}"</p>
                </div>
              )}

              <div className="mb-4">
                <h6 className="text-primary text-uppercase fw-bold small mb-2">Technologies Used</h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedProject.tech ? selectedProject.tech.map((t, i) => (
                    <span key={i} className="badge bg-dark text-light border border-secondary px-3 py-2">{t}</span>
                  )) : <span className="badge bg-dark text-light border border-secondary px-3 py-2">React</span>}
                </div>
              </div>

              <div className="d-flex gap-3 mt-5">
                <a href={selectedProject.codeLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2">
                  <FaGithub /> Source Code
                </a>
                {selectedProject.liveLink !== "#" && (
                  <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2">
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content p-4 rounded-4 shadow-lg" 
               style={{ maxWidth: "500px", width: "90%", background: "#131738", border: "1px solid #2d3748" }}
               onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-white fw-bold mb-0">Add New Project</h4>
              <button className="btn btn-outline-light btn-sm rounded-circle" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <div className="mb-3">
              <label className="text-secondary small mb-1">Project Title</label>
              <input type="text" className="form-control bg-dark border-secondary text-white" placeholder="e.g. E-commerce App" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="text-secondary small mb-1">Image URL</label>
              <input type="text" className="form-control bg-dark border-secondary text-white" placeholder="https://..." value={formData.img} onChange={e => setFormData({ ...formData, img: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="text-secondary small mb-1">Description</label>
              <textarea className="form-control bg-dark border-secondary text-white" rows="3" placeholder="Briefly describe your project..." value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })}></textarea>
            </div>
            <div className="row mb-4">
              <div className="col">
                <label className="text-secondary small mb-1">Code Link</label>
                <input type="text" className="form-control bg-dark border-secondary text-white" value={formData.codeLink} onChange={e => setFormData({ ...formData, codeLink: e.target.value })} />
              </div>
              <div className="col">
                <label className="text-secondary small mb-1">Live Link</label>
                <input type="text" className="form-control bg-dark border-secondary text-white" value={formData.liveLink} onChange={e => setFormData({ ...formData, liveLink: e.target.value })} />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-link text-secondary text-decoration-none" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary px-4 rounded-pill" onClick={addProject}>Add Project</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .project-card { cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid rgba(255,255,255,0.05); }
        .project-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.6) !important; border-color: #0d6efd; }
        .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(13, 23, 56, 0.9); opacity: 0; transition: all 0.3s ease; backdrop-filter: blur(4px); }
        .project-card:hover .overlay { opacity: 1; }
        .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(8px); }
        .form-control:focus { background-color: #1a1f36 !important; border-color: #0d6efd !important; color: white !important; box-shadow: none; }
      `}</style>
    </div>
  );
}