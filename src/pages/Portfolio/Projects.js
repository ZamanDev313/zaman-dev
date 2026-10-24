
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/portfolio/Projects.css";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  FaTimes,
  FaLaptopCode,
  FaDatabase,
  FaGlobe,
  FaGithub,
  FaExternalLinkAlt,
} from "react-icons/fa";

const getProjectIcon = (category) => {
  switch ((category || "").toLowerCase()) {
    case "backend":
    case "database":
    case "full-stack":
      return <FaDatabase />;
    case "web":
    case "wordpress":
    case "shopify":
      return <FaGlobe />;
    default:
      return <FaLaptopCode />;
  }
};

const fallbackImage =
  "https://placehold.co/800x450/131738/e6eef8?text=Project+Preview";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "Published")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const formattedProjects = (data || []).map((project) => ({
        ...project,
        img: project.image_url || "",
        desc: project.description || "",
        tech: Array.isArray(project.technologies)
          ? project.technologies
          : [],
        codeLink: project.github_url || "",
        liveLink: project.live_url || "",
        challenge: project.challenge || "",
        icon: getProjectIcon(project.category),
      }));

      setProjects(formattedProjects);
    } catch (fetchError) {
      console.error("Projects fetch error:", fetchError.message);
      setError(
        "Projects load nahi ho sake. Internet connection check karke dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (!selectedProject) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedProject]);

  return (
    <section
      className="container-fluid py-5 projects-section"
      style={{
        background: "#1a1f36",
        color: "#e6eef8",
        minHeight: "100vh",
      }}
    >
      <div className="text-center mb-5">
        <h1 className="text-primary fw-bold display-4">MY PROJECTS</h1>

        <p
          className="text-light mx-auto fs-5"
          style={{ maxWidth: "700px" }}
        >
          A showcase of my technical journey, from frontend designs
          to full-stack integrations.
        </p>
      </div>

      <div className="container">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-5" role="status">
            <div
              className="spinner-border text-primary mb-3"
              aria-hidden="true"
            />
            <p className="text-light mb-0">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-5" role="alert">
            <p className="text-light mb-3">{error}</p>
            <button
              type="button"
              className="btn btn-primary rounded-pill px-4"
              onClick={fetchProjects}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-5">
            <FaLaptopCode className="text-primary mb-3" size={42} />
            <h3 className="text-white">Projects Coming Soon</h3>
            <p className="text-secondary">
              New projects will appear here soon.
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="row justify-content-center g-4">
            {projects.map((project) => (
              <div key={project.id} className="col-lg-4 col-md-6">
                <article
                  className="project-card position-relative rounded-4 overflow-hidden shadow-lg bg-dark h-100"
                >
                  <button
                    type="button"
                    className="project-card-trigger"
                    onClick={() => setSelectedProject(project)}
                    aria-label={`View details for ${project.title}`}
                  >
                    <div
                      className="img-container"
                      style={{ height: "250px", overflow: "hidden" }}
                    >
                      <img
                        src={project.img || fallbackImage}
                        alt={`${project.title} preview`}
                        className="img-fluid w-100 h-100 object-fit-cover"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>

                    <div className="p-4 text-start">
                      <div className="d-flex align-items-center mb-2">
                        <span className="text-primary me-2 fs-4">
                          {project.icon}
                        </span>

                        <h5 className="text-white fw-bold mb-0 text-truncate">
                          {project.title}
                        </h5>
                      </div>

                      <p className="text-secondary small mb-3 text-truncate-2">
                        {project.desc || "Project details coming soon."}
                      </p>

                      <div className="d-flex flex-wrap gap-2">
                        {project.tech.slice(0, 3).map((technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1"
                          >
                            {technology}
                          </span>
                        ))}

                        {project.tech.length > 3 && (
                          <span className="badge bg-secondary-subtle text-light">
                            +{project.tech.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="overlay d-flex flex-column justify-content-center align-items-center text-center p-3">
                      <h5 className="text-white fw-bold mb-3">
                        {project.title}
                      </h5>
                      <span className="btn btn-primary rounded-pill px-4">
                        Learn More
                      </span>
                    </div>
                  </button>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="project-modal-content rounded-4 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="position-relative">
              <img
                src={selectedProject.img || fallbackImage}
                alt={`${selectedProject.title} preview`}
                className="w-100"
                style={{
                  maxHeight: "350px",
                  objectFit: "cover",
                }}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = fallbackImage;
                }}
              />

              <button
                type="button"
                className="btn btn-dark rounded-circle position-absolute top-0 end-0 m-3"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4 p-md-5">
              <div className="d-flex align-items-center mb-3">
                <span className="text-primary me-3 fs-2">
                  {selectedProject.icon}
                </span>

                <h2
                  id="project-modal-title"
                  className="text-white fw-bold mb-0"
                >
                  {selectedProject.title}
                </h2>
              </div>

              <div className="mb-4">
                <h6 className="text-primary text-uppercase fw-bold small mb-2">
                  Description
                </h6>
                <p className="text-light opacity-75">
                  {selectedProject.desc || "No description available."}
                </p>
              </div>

              {selectedProject.challenge && (
                <div
                  className="mb-4 p-3 rounded-3"
                  style={{
                    background: "rgba(13, 110, 253, 0.1)",
                    borderLeft: "4px solid #0d6efd",
                  }}
                >
                  <h6 className="text-primary text-uppercase fw-bold small mb-2">
                    Key Challenge & Learning
                  </h6>
                  <p className="text-light mb-0">
                    "{selectedProject.challenge}"
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h6 className="text-primary text-uppercase fw-bold small mb-2">
                  Technologies Used
                </h6>

                <div className="d-flex flex-wrap gap-2">
                  {selectedProject.tech.length > 0 ? (
                    selectedProject.tech.map((technology, index) => (
                      <span
                        key={`${technology}-${index}`}
                        className="badge bg-dark text-light border border-secondary px-3 py-2"
                      >
                        {technology}
                      </span>
                    ))
                  ) : (
                    <span className="text-secondary">
                      Technologies not specified.
                    </span>
                  )}
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3 mt-4">
                {selectedProject.codeLink && (
                  <a
                    href={selectedProject.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                  >
                    <FaGithub /> Source Code
                  </a>
                )}

                {selectedProject.liveLink &&
                  selectedProject.liveLink !== "#" && (
                    <a
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
