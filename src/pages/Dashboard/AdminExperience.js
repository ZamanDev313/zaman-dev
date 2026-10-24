
import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCode,
  FaFigma,
  FaWordpress,
  FaShopify,
  FaSearch,
  FaClipboardCheck,
  FaLaptopCode,
  FaPalette,
  FaGlobe,
  FaDatabase,
  FaMobileAlt,
  FaBug,
  FaRocket,
  FaCheckCircle,
  FaChevronUp,
  FaChevronDown,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { supabase } from "../../supabaseClient";
import "../../styles/Dashboard/AdminExperience.css";

// Icon names are saved in Supabase, not React components.
const ICON_OPTIONS = [
  { value: "FaCode", label: "Code", Icon: FaCode },
  { value: "FaFigma", label: "Figma / Design", Icon: FaFigma },
  { value: "FaWordpress", label: "WordPress", Icon: FaWordpress },
  { value: "FaShopify", label: "Shopify", Icon: FaShopify },
  { value: "FaSearch", label: "SEO / Search", Icon: FaSearch },
  {
    value: "FaClipboardCheck",
    label: "Quality Assurance",
    Icon: FaClipboardCheck,
  },
  {
    value: "FaLaptopCode",
    label: "Web Development",
    Icon: FaLaptopCode,
  },
  { value: "FaPalette", label: "UI / Design", Icon: FaPalette },
  { value: "FaGlobe", label: "Website / Globe", Icon: FaGlobe },
  { value: "FaDatabase", label: "Database", Icon: FaDatabase },
  { value: "FaMobileAlt", label: "Responsive / Mobile", Icon: FaMobileAlt },
  { value: "FaBug", label: "Testing / Debugging", Icon: FaBug },
  { value: "FaRocket", label: "Deployment / Launch", Icon: FaRocket },
  {
    value: "FaCheckCircle",
    label: "Completed / Verified",
    Icon: FaCheckCircle,
  },
  { value: "FaBriefcase", label: "Professional Work", Icon: FaBriefcase },
];

const ICON_MAP = Object.fromEntries(
  ICON_OPTIONS.map(({ value, Icon }) => [value, Icon])
);

const createResponsibility = () => ({
  title: "",
  description: "",
  icon: "FaCode",
});

const initialForm = {
  role: "",
  company: "",
  employment_type: "Full-time",
  location: "",
  start_month: "",
  end_month: "",
  currently_working: false,
  description: "",
  responsibilities: [],
  technologiesText: "",
  achievement: "",
  sort_order: 0,
  is_published: false,
};

function toMonthInput(value) {
  if (!value) return "";

  // Supports both YYYY-MM and a full ISO date.
  return String(value).slice(0, 7);
}

function formatMonth(value) {
  if (!value) return "";

  const [year, month] = value.split("-");

  return new Date(
    Number(year),
    Number(month) - 1
  ).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function normalizeResponsibilities(value) {
  if (!Array.isArray(value)) return [];

  return value.map((item) => ({
    title: item?.title || "",
    description: item?.description || "",
    // Existing records without an icon use FaCode by default.
    icon: ICON_MAP[item?.icon] ? item.icon : "FaCode",
  }));
}

function createFormFromRecord(item) {
  return {
    role: item.role || "",
    company: item.company || "",
    employment_type: item.employment_type || "Full-time",
    location: item.location || "",
    start_month: toMonthInput(item.start_month),
    end_month: toMonthInput(item.end_month),
    currently_working: Boolean(item.currently_working),
    description: item.description || "",
    responsibilities: normalizeResponsibilities(item.responsibilities),
    technologiesText: Array.isArray(item.technologies)
      ? item.technologies.join(", ")
      : "",
    achievement: item.achievement || "",
    sort_order: item.sort_order ?? 0,
    is_published: Boolean(item.is_published),
  };
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [search, setSearch] = useState("");

  const isEditing = editingId !== null;

  async function fetchExperiences() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("professional_experience")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

      if (error) throw error;

      setExperiences(data || []);
    } catch (error) {
      console.error("Fetch experiences error:", error);
      setNotice({
        type: "error",
        message: error.message || "Experiences load nahi ho sakin.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExperiences();
  }, []);

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function editExperience(item) {
    setEditingId(item.id);
    setForm(createFormFromRecord(item));
    setNotice(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function addResponsibility() {
    setForm((previous) => ({
      ...previous,
      responsibilities: [
        ...previous.responsibilities,
        createResponsibility(),
      ],
    }));
  }

  function updateResponsibility(index, field, value) {
    setForm((previous) => ({
      ...previous,
      responsibilities: previous.responsibilities.map((item, i) =>
        i === index
          ? { ...item, [field]: value }
          : item
      ),
    }));
  }

  function removeResponsibility(index) {
    setForm((previous) => ({
      ...previous,
      responsibilities: previous.responsibilities.filter(
        (_, i) => i !== index
      ),
    }));
  }

  function moveResponsibility(index, direction) {
    setForm((previous) => {
      const items = [...previous.responsibilities];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= items.length) {
        return previous;
      }

      [items[index], items[targetIndex]] = [
        items[targetIndex],
        items[index],
      ];

      return {
        ...previous,
        responsibilities: items,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      if (!form.role.trim() || !form.company.trim()) {
        throw new Error("Job title aur company name required hain.");
      }

      if (!form.start_month) {
        throw new Error("Start date select karein.");
      }

      if (
        !form.currently_working &&
        form.end_month &&
        form.end_month < form.start_month
      ) {
        throw new Error("End date, start date se pehle nahi ho sakti.");
      }

      const responsibilities = form.responsibilities
        .map((item) => ({
          title: item.title.trim(),
          description: item.description.trim(),
          // Persist the icon identifier as a JSON string.
          icon: ICON_MAP[item.icon] ? item.icon : "FaCode",
        }))
        .filter((item) => item.title || item.description);

      const technologies = form.technologiesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        role: form.role.trim(),
        company: form.company.trim(),
        employment_type: form.employment_type,
        location: form.location.trim() || null,
        start_month: form.start_month,
        end_month: form.currently_working
          ? null
          : form.end_month || null,
        currently_working: form.currently_working,
        description: form.description.trim() || null,
        responsibilities,
        technologies,
        achievement: form.achievement.trim() || null,
        sort_order: Number(form.sort_order) || 0,
        is_published: form.is_published,
      };

      let result;

      if (isEditing) {
        result = await supabase
          .from("professional_experience")
          .update(payload)
          .eq("id", editingId)
          .select()
          .single();
      } else {
        result = await supabase
          .from("professional_experience")
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setNotice({
        type: "success",
        message: isEditing
          ? "Experience successfully update ho gayi."
          : "Experience successfully save ho gayi.",
      });

      resetForm();
      await fetchExperiences();
    } catch (error) {
      console.error("Save experience error:", error);
      setNotice({
        type: "error",
        message: error.message || "Experience save nahi ho saki.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(item) {
    const { error } = await supabase
      .from("professional_experience")
      .update({ is_published: !item.is_published })
      .eq("id", item.id);

    if (error) {
      console.error("Publish experience error:", error);
      setNotice({
        type: "error",
        message: error.message || "Publish status update nahi hua.",
      });
      return;
    }

    setNotice({
      type: "success",
      message: item.is_published
        ? "Experience draft mein move ho gayi."
        : "Experience publish ho gayi.",
    });

    await fetchExperiences();
  }

  async function deleteExperience(item) {
    const confirmed = window.confirm(
      `Kya aap "${item.role}" experience delete karna chahte hain?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("professional_experience")
      .delete()
      .eq("id", item.id);

    if (error) {
      console.error("Delete experience error:", error);
      setNotice({
        type: "error",
        message: error.message || "Experience delete nahi hui.",
      });
      return;
    }

    if (editingId === item.id) resetForm();

    setNotice({
      type: "success",
      message: "Experience delete ho gayi.",
    });

    await fetchExperiences();
  }

  const filteredExperiences = experiences.filter((item) => {
    const searchText = `${item.role} ${item.company}`.toLowerCase();
    return searchText.includes(search.toLowerCase());
  });

  return (
    <div className="admin-experience">
      <header className="admin-experience-header">
        <div>
          <h1>Professional Experience</h1>
          <p>
            Manage your work history, responsibilities, icons and technologies.
          </p>
        </div>
      </header>

      {notice && (
        <div
          className={`admin-experience-notice ${notice.type}`}
          role={notice.type === "error" ? "alert" : "status"}
        >
          <span>{notice.message}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <section className="admin-experience-form-section">
        <h2>{isEditing ? "Edit Experience" : "Add Experience"}</h2>

        <form onSubmit={handleSubmit} className="admin-experience-form">
          <div className="admin-experience-grid">
            <label>
              Job Title *
              <input
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
                placeholder="Frontend Developer"
                required
              />
            </label>

            <label>
              Company *
              <input
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="Company name"
                required
              />
            </label>

            <label>
              Employment Type *
              <select
                value={form.employment_type}
                onChange={(e) =>
                  updateField("employment_type", e.target.value)
                }
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Contract">Contract</option>
              </select>
            </label>

            <label>
              Location
              <input
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Karachi, Pakistan / Remote"
              />
            </label>

            <label>
              Start Month *
              <input
                type="month"
                value={form.start_month}
                onChange={(e) => updateField("start_month", e.target.value)}
                required
              />
            </label>

            <label>
              End Month
              <input
                type="month"
                value={form.end_month}
                disabled={form.currently_working}
                min={form.start_month || undefined}
                onChange={(e) => updateField("end_month", e.target.value)}
              />
            </label>
          </div>

          <label className="admin-experience-checkbox">
            <input
              type="checkbox"
              checked={form.currently_working}
              onChange={(e) =>
                updateField("currently_working", e.target.checked)
              }
            />
            I currently work here
          </label>

          <label>
            Summary / Description
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              placeholder="Describe your role and experience..."
            />
          </label>

          {/* RESPONSIBILITIES WITH ICON SELECTOR */}
          <section className="admin-responsibilities">
            <div className="admin-responsibilities-header">
              <div>
                <h3>Key Responsibilities</h3>
                <p>
                  Har responsibility ka title, description aur icon select karein.
                </p>
              </div>

              <button
                type="button"
                className="admin-experience-button secondary"
                onClick={addResponsibility}
              >
                <FaPlus /> Add Responsibility
              </button>
            </div>

            {form.responsibilities.length === 0 && (
              <p className="admin-responsibilities-empty">
                Abhi koi responsibility add nahi ki gayi.
              </p>
            )}

            {form.responsibilities.map((item, index) => {
              const SelectedIcon = ICON_MAP[item.icon] || FaCode;

              return (
                <article
                  className="admin-responsibility-item"
                  key={`responsibility-${index}`}
                >
                  <div className="admin-responsibility-top">
                    <strong>Responsibility {index + 1}</strong>

                    <div className="admin-responsibility-actions">
                      <button
                        type="button"
                        title="Move up"
                        aria-label={`Move responsibility ${index + 1} up`}
                        disabled={index === 0}
                        onClick={() => moveResponsibility(index, -1)}
                      >
                        <FaChevronUp />
                      </button>

                      <button
                        type="button"
                        title="Move down"
                        aria-label={`Move responsibility ${index + 1} down`}
                        disabled={
                          index === form.responsibilities.length - 1
                        }
                        onClick={() => moveResponsibility(index, 1)}
                      >
                        <FaChevronDown />
                      </button>

                      <button
                        type="button"
                        className="delete"
                        title="Remove responsibility"
                        aria-label={`Remove responsibility ${index + 1}`}
                        onClick={() => removeResponsibility(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <label>
                    Responsibility Title
                    <input
                      value={item.title}
                      onChange={(e) =>
                        updateResponsibility(index, "title", e.target.value)
                      }
                      placeholder="e.g. Figma to Custom Code"
                    />
                  </label>

                  <div className="admin-responsibility-icon-field">
                    <label>
                      Select Icon
                      <select
                        value={ICON_MAP[item.icon] ? item.icon : "FaCode"}
                        onChange={(e) =>
                          updateResponsibility(index, "icon", e.target.value)
                        }
                      >
                        {ICON_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div
                      className="admin-responsibility-icon-preview"
                      title="Selected icon preview"
                    >
                      <SelectedIcon />
                      <span>{ICON_OPTIONS.find(
                        (option) => option.value === item.icon
                      )?.label || "Code"}</span>
                    </div>
                  </div>

                  <label>
                    Responsibility Description
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateResponsibility(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder="Explain what you did..."
                    />
                  </label>
                </article>
              );
            })}
          </section>

          <label>
            Technologies & Areas
            <input
              value={form.technologiesText}
              onChange={(e) =>
                updateField("technologiesText", e.target.value)
              }
              placeholder="HTML, CSS, JavaScript, React"
            />
            <small>Technologies ko commas se separate karein.</small>
          </label>

          <label>
            Key Achievement
            <textarea
              value={form.achievement}
              onChange={(e) => updateField("achievement", e.target.value)}
              rows={3}
              placeholder="Your key achievement..."
            />
          </label>

          <label>
            Sort Order
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => updateField("sort_order", e.target.value)}
            />
          </label>

          <label className="admin-experience-checkbox">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => updateField("is_published", e.target.checked)}
            />
            Publish on public portfolio
          </label>

          <div className="admin-experience-form-actions">
            <button
              type="submit"
              className="admin-experience-button primary"
              disabled={saving}
            >
              <FaSave />
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Experience"
                  : "Save Experience"}
            </button>

            {isEditing && (
              <button
                type="button"
                className="admin-experience-button secondary"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* EXISTING EXPERIENCE RECORDS */}
      <section className="admin-experience-list-section">
        <div className="admin-experience-list-header">
          <h2>Saved Experiences ({experiences.length})</h2>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experience..."
            aria-label="Search experiences"
          />
        </div>

        {loading ? (
          <p>Loading experiences...</p>
        ) : filteredExperiences.length === 0 ? (
          <p>No experiences found.</p>
        ) : (
          <div className="admin-experience-list">
            {filteredExperiences.map((item) => (
              <article
                className="admin-experience-list-card"
                key={item.id}
              >
                <div>
                  <h3>{item.role}</h3>
                  <p>{item.company}</p>

                  <small>
                    {formatMonth(item.start_month)} —{" "}
                    {item.currently_working
                      ? "Present"
                      : formatMonth(item.end_month) || "End date not set"}
                  </small>

                  <div className="admin-experience-list-status">
                    <span>
                      {item.employment_type}
                    </span>

                    <span
                      className={
                        item.is_published ? "published" : "draft"
                      }
                    >
                      {item.is_published ? "Published" : "Draft"}
                    </span>
                  </div>

                  {Array.isArray(item.responsibilities) &&
                    item.responsibilities.length > 0 && (
                      <div className="admin-responsibility-saved-preview">
                        <strong>Responsibilities:</strong>

                        {item.responsibilities.map((responsibility, index) => {
                          const Icon =
                            ICON_MAP[responsibility.icon] || FaCode;

                          return (
                            <span key={`${item.id}-resp-${index}`}>
                              <Icon /> {responsibility.title || "Untitled"}
                            </span>
                          );
                        })}
                      </div>
                    )}
                </div>

                <div className="admin-experience-card-actions">
                  <button
                    type="button"
                    onClick={() => editExperience(item)}
                    title="Edit experience"
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePublished(item)}
                    title={
                      item.is_published
                        ? "Move to draft"
                        : "Publish experience"
                    }
                  >
                    {item.is_published ? <FaEyeSlash /> : <FaEye />}
                    {item.is_published ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() => deleteExperience(item)}
                    title="Delete experience"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
