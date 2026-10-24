
import React, { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiGithub,
  FiFolder,
  FiX,
} from "react-icons/fi";
import { supabase } from "../../supabaseClient";
import { useAdminToast } from "./AdminToast";

const emptyForm = {
  title: "",
  description: "",
  imageUrl: "",
  technologies: "",
  liveUrl: "",
  githubUrl: "",
  category: "Frontend",
  status: "Draft",
  featured: false,
};

// Database row ko form ke format mein convert karo.
const mapProjectFromDatabase = (project) => ({
  id: project.id,
  title: project.title ?? "",
  description: project.description ?? "",
  imageUrl: project.image_url ?? "",
  technologies: Array.isArray(project.technologies)
    ? project.technologies.join(", ")
    : "",
  liveUrl: project.live_url ?? "",
  githubUrl: project.github_url ?? "",
  category: project.category ?? "Frontend",
  status: project.status ?? "Draft",
  featured: project.featured ?? false,
});

// Form data ko database ke format mein convert karo.
const mapProjectToDatabase = (form) => ({
  title: form.title.trim(),
  description: form.description.trim() || null,
  image_url: form.imageUrl.trim() || null,
  technologies: form.technologies
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean),
  live_url: form.liveUrl.trim() || null,
  github_url: form.githubUrl.trim() || null,
  category: form.category,
  status: form.status,
  featured: form.featured,
});

function AdminProjects() {
  const { showToast } = useAdminToast();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Supabase se projects load karo.
  useEffect(() => {
    let active = true;

    const loadProjects = async () => {
      setLoading(true);

      try {
        const { data, error: fetchError } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        if (active) {
          setProjects((data ?? []).map(mapProjectFromDatabase));
        }
      } catch (err) {
        console.error("Projects load failed:", err);

        if (active) {
          showToast(
            "Projects load nahi ho sake. Database connection aur RLS policies check karein.",
            "error"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProjects();

    return () => {
      active = false;
    };
  }, [showToast]);

  // Search aur filters.
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.technologies.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        project.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [projects, search, statusFilter, categoryFilter]);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      technologies: project.technologies,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      category: project.category,
      status: project.status,
      featured: project.featured,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Naya project insert karo ya existing project update karo.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    if (!form.title.trim()) {
      showToast("Project title required hai.", "error");
      return;
    }

    setSaving(true);

    try {
      const projectData = mapProjectToDatabase(form);
      const isEditing = editingId !== null;
      let savedProject;

      if (isEditing) {
        const { data, error: updateError } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingId)
          .select()
          .single();

        if (updateError) throw updateError;

        savedProject = data;

        setProjects((previous) =>
          previous.map((project) =>
            project.id === editingId
              ? mapProjectFromDatabase(savedProject)
              : project
          )
        );
      } else {
        const { data, error: insertError } = await supabase
          .from("projects")
          .insert(projectData)
          .select()
          .single();

        if (insertError) throw insertError;

        savedProject = data;

        setProjects((previous) => [
          mapProjectFromDatabase(savedProject),
          ...previous,
        ]);
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      showToast(
        isEditing
          ? "Project successfully update ho gaya."
          : "Project successfully database mein save ho gaya.",
        "success"
      );
    } catch (err) {
      console.error("Project save failed:", err);

      showToast(
        err.message ||
          "Project save nahi hua. Login aur database permissions check karein.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Database se project delete karo.
  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Kya aap "${project.title}" ko permanently delete karna chahte hain?`
    );

    if (!confirmed || deletingId !== null) return;

    setDeletingId(project.id);

    try {
      const { error: deleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (deleteError) throw deleteError;

      setProjects((previous) =>
        previous.filter((item) => item.id !== project.id)
      );

      showToast("Project database se delete ho gaya.", "success");
    } catch (err) {
      console.error("Project delete failed:", err);

      showToast(
        err.message ||
          "Project delete nahi hua. Database permissions check karein.",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="admin-projects">
      <div className="admin-projects-heading">
        <div>
          <span className="admin-eyebrow">PORTFOLIO CONTENT</span>
          <h2>Projects Management</h2>
          <p>Apne portfolio projects ko yahan manage karein.</p>
        </div>

        <button
          type="button"
          className="admin-primary-button admin-project-add"
          onClick={openAddForm}
        >
          <FiPlus size={17} />
          Add New Project
        </button>
      </div>

      <div className="admin-project-summary">
        <div>
          <span>Total Projects</span>
          <strong>{projects.length}</strong>
        </div>

        <div>
          <span>Published</span>
          <strong>
            {
              projects.filter(
                (project) => project.status === "Published"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Drafts</span>
          <strong>
            {
              projects.filter(
                (project) => project.status === "Draft"
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="admin-project-toolbar">
        <label className="admin-project-search">
          <FiSearch size={17} />
          <input
            type="search"
            placeholder="Search by project name or technology..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>

        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option value="All">All categories</option>
          <option value="Frontend">Frontend</option>
          <option value="Full Stack">Full Stack</option>
          <option value="WordPress">WordPress</option>
          <option value="Shopify">Shopify</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="admin-project-table-wrap">
        <table className="admin-project-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Technologies</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">
                  <div className="admin-project-empty">
                    <p>Projects load ho rahe hain...</p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="admin-project-name">
                        <div className="admin-project-icon">
                          <FiFolder size={19} />
                        </div>

                        <div>
                          <strong>{project.title}</strong>
                          <span>
                            {project.description ||
                              "No description added"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>{project.technologies || "—"}</td>
                    <td>{project.category}</td>

                    <td>
                      <span
                        className={`admin-project-status ${
                          project.status === "Published"
                            ? "published"
                            : "draft"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td>{project.featured ? "Yes" : "No"}</td>

                    <td>
                      <div className="admin-project-actions">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${project.title} live demo`}
                            title="Live demo"
                          >
                            <FiExternalLink size={16} />
                          </a>
                        )}

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${project.title} GitHub repository`}
                            title="GitHub repository"
                          >
                            <FiGithub size={16} />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => openEditForm(project)}
                          aria-label={`Edit ${project.title}`}
                          title="Edit project"
                          disabled={deletingId !== null}
                        >
                          <FiEdit2 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(project)}
                          aria-label={`Delete ${project.title}`}
                          title="Delete project"
                          disabled={deletingId !== null}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <div className="admin-project-empty">
                        <FiFolder size={30} />

                        <strong>
                          {projects.length === 0
                            ? "No projects added yet"
                            : "No matching projects found"}
                        </strong>

                        <p>
                          {projects.length === 0
                            ? "Add a project to start managing your portfolio."
                            : "Search ya filters change karke dobara try karein."}
                        </p>

                        {projects.length === 0 && (
                          <button
                            type="button"
                            className="admin-primary-button"
                            onClick={openAddForm}
                          >
                            <FiPlus size={16} />
                            Add Your First Project
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      <p className="admin-data-notice">
        Projects ab Supabase database se load aur save hote hain.
      </p>

      {showForm && (
        <div
          className="admin-project-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              closeForm();
            }
          }}
        >
          <section
            className="admin-project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-project-modal-title"
          >
            <div className="admin-project-modal-heading">
              <div>
                <span className="admin-eyebrow">PROJECT DETAILS</span>
                <h2 id="admin-project-modal-title">
                  {editingId !== null
                    ? "Edit Project"
                    : "Add New Project"}
                </h2>
              </div>

              <button
                type="button"
                className="admin-project-modal-close"
                onClick={closeForm}
                aria-label="Close form"
                disabled={saving}
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="admin-project-form"
            >
              <label>
                Project title *
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. My React Portfolio"
                  required
                  maxLength={120}
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Project ke baare mein short description..."
                  rows={3}
                />
              </label>

              <label>
                Project Image URL
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/project-image.jpg"
                />
              </label>

              {form.imageUrl.trim() && (
                <div style={{ marginBottom: "16px" }}>
                  <span
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                  >
                    Image Preview
                  </span>

                  <img
                    src={form.imageUrl}
                    alt="Project preview"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.visibility = "visible";
                    }}
                    style={{
                      width: "100%",
                      maxWidth: "320px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "1px solid #334155",
                    }}
                  />
                </div>
              )}

              <label>
                Technologies
                <input
                  name="technologies"
                  value={form.technologies}
                  onChange={handleChange}
                  placeholder="React, JavaScript, CSS"
                />
              </label>

              <div className="admin-project-form-row">
                <label>
                  Category
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option>Frontend</option>
                    <option>Full Stack</option>
                    <option>WordPress</option>
                    <option>Shopify</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                </label>
              </div>

              <label>
                Live demo URL
                <input
                  type="url"
                  name="liveUrl"
                  value={form.liveUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </label>

              <label>
                GitHub repository URL
                <input
                  type="url"
                  name="githubUrl"
                  value={form.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repository"
                />
              </label>

              <label className="admin-project-featured-toggle">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                Feature this project on the homepage
              </label>

              <div className="admin-project-form-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Add Project"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

export default AdminProjects;
