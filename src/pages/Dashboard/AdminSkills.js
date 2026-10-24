
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCode,
  FiStar,
  FiBookOpen,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaBootstrap,
  FaPhp,
  FaDatabase,
  FaGitAlt,
  FaWordpress,
  FaShopify,
  FaFigma,
  FaLaptopCode,
  FaTools,
  FaNodeJs,
} from "react-icons/fa";

import { supabase } from "../../supabaseClient";

// --------------------------------------------------
// SKILLS CONFIGURATION
// --------------------------------------------------

const skillIcons = {
  FiCode,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaBootstrap,
  FaPhp,
  FaDatabase,
  FaGitAlt,
  FaWordpress,
  FaShopify,
  FaFigma,
  FaLaptopCode,
  FaTools,
  FaNodeJs,
};

const categories = [
  "All",
  "Frontend Development",
  "CMS & Web Design",
  "Backend & Tools",
  "Frontend",
  "Backend",
  "CMS & E-commerce",
  "Tools",
];

const emptySkill = {
  name: "",
  category: "Frontend Development",
  level: "Learning",
  featured: false,
  icon_key: "FiCode",
  color: "#61dafb",
  sort_order: 0,
  is_active: true,
};

const emptyLearning = {
  title: "",
  sort_order: 0,
  is_active: true,
};

function AdminSkills() {
  // --------------------------------------------------
  // SKILLS STATE
  // --------------------------------------------------

  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptySkill });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // --------------------------------------------------
  // CURRENTLY LEARNING STATE
  // --------------------------------------------------

  const [learningItems, setLearningItems] = useState([]);
  const [learningSearch, setLearningSearch] = useState("");
  const [learningFilter, setLearningFilter] = useState("All");

  const [showLearningForm, setShowLearningForm] = useState(false);
  const [editingLearningId, setEditingLearningId] = useState(null);
  const [learningForm, setLearningForm] = useState({
    ...emptyLearning,
  });

  const [learningLoading, setLearningLoading] = useState(true);
  const [learningSaving, setLearningSaving] = useState(false);
  const [learningError, setLearningError] = useState("");
  const [learningNotice, setLearningNotice] = useState("");

  // --------------------------------------------------
  // LOAD SKILLS
  // --------------------------------------------------

  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return false;
    }

    setSkills(data || []);
    setLoading(false);
    return true;
  }, []);

  // --------------------------------------------------
  // LOAD CURRENTLY LEARNING ITEMS
  // --------------------------------------------------

  const loadLearningItems = useCallback(async () => {
    setLearningLoading(true);
    setLearningError("");

    const { data, error: fetchError } = await supabase
      .from("learning_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (fetchError) {
      setLearningError(fetchError.message);
      setLearningLoading(false);
      return false;
    }

    setLearningItems(data || []);
    setLearningLoading(false);
    return true;
  }, []);

  useEffect(() => {
    loadSkills();
    loadLearningItems();
  }, [loadSkills, loadLearningItems]);

  // --------------------------------------------------
  // FILTER SKILLS
  // --------------------------------------------------

  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesSearch = (skill.name || "")
        .toLowerCase()
        .includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        skill.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [skills, search, categoryFilter]);

  // --------------------------------------------------
  // FILTER LEARNING ITEMS
  // --------------------------------------------------

  const filteredLearningItems = useMemo(() => {
    const query = learningSearch.trim().toLowerCase();

    return learningItems.filter((item) => {
      const matchesSearch = (item.title || "")
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        learningFilter === "All" ||
        (learningFilter === "Active" && item.is_active) ||
        (learningFilter === "Hidden" && !item.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [learningItems, learningSearch, learningFilter]);

  // --------------------------------------------------
  // SKILL FORM HANDLERS
  // --------------------------------------------------

  const openAddForm = () => {
    const nextOrder =
      skills.length > 0
        ? Math.max(
            ...skills.map((skill) => skill.sort_order ?? 0)
          ) + 1
        : 0;

    setEditingId(null);
    setForm({ ...emptySkill, sort_order: nextOrder });
    setError("");
    setNotice("");
    setShowForm(true);
  };

  const openEditForm = (skill) => {
    setEditingId(skill.id);

    setForm({
      name: skill.name || "",
      category: skill.category || "Frontend Development",
      level: skill.level || "Learning",
      featured: Boolean(skill.featured),
      icon_key: skill.icon_key || "FiCode",
      color: skill.color || "#61dafb",
      sort_order: skill.sort_order ?? 0,
      is_active: skill.is_active ?? true,
    });

    setError("");
    setNotice("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptySkill });
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : name === "sort_order"
            ? value === ""
              ? 0
              : Number(value)
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name || saving) return;

    setSaving(true);
    setError("");
    setNotice("");

    const skillData = {
      name,
      category: form.category,
      level: form.level,
      featured: form.featured,
      icon_key: form.icon_key,
      color: form.color,
      sort_order: form.sort_order,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    try {
      const result =
        editingId !== null
          ? await supabase
              .from("skills")
              .update(skillData)
              .eq("id", editingId)
              .select()
          : await supabase
              .from("skills")
              .insert([skillData])
              .select();

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (!result.data || result.data.length === 0) {
        setError(
          "Skill save nahi hui. Admin login aur Supabase RLS policies check karein."
        );
        return;
      }

      const wasEditing = editingId !== null;
      const refreshed = await loadSkills();

      setNotice(
        refreshed
          ? wasEditing
            ? "Skill successfully update ho gayi."
            : "Skill successfully add ho gayi."
          : "Skill save ho gayi, lekin list refresh nahi ho saki."
      );

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptySkill });
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skill) => {
    if (
      !window.confirm(
        `Kya aap "${skill.name}" ko permanently delete karna chahte hain?`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");

    const { data, error: deleteError } = await supabase
      .from("skills")
      .delete()
      .eq("id", skill.id)
      .select();

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (!data || data.length === 0) {
      setError(
        "Skill delete nahi hui. Admin login aur delete permissions check karein."
      );
      return;
    }

    setSkills((previous) =>
      previous.filter((item) => item.id !== skill.id)
    );

    setNotice(`"${skill.name}" successfully delete ho gayi.`);
  };

  const getSkillIcon = (iconKey) => {
    const IconComponent = skillIcons[iconKey] || FiCode;
    return <IconComponent size={21} />;
  };

  // --------------------------------------------------
  // CURRENTLY LEARNING FORM HANDLERS
  // --------------------------------------------------

  const openAddLearningForm = () => {
    const nextOrder =
      learningItems.length > 0
        ? Math.max(
            ...learningItems.map((item) => item.sort_order ?? 0)
          ) + 1
        : 1;

    setEditingLearningId(null);
    setLearningForm({
      ...emptyLearning,
      sort_order: nextOrder,
    });
    setLearningError("");
    setLearningNotice("");
    setShowLearningForm(true);
  };

  const openEditLearningForm = (item) => {
    setEditingLearningId(item.id);

    setLearningForm({
      title: item.title || "",
      sort_order: item.sort_order ?? 0,
      is_active: item.is_active ?? true,
    });

    setLearningError("");
    setLearningNotice("");
    setShowLearningForm(true);
  };

  const closeLearningForm = () => {
    if (learningSaving) return;

    setShowLearningForm(false);
    setEditingLearningId(null);
    setLearningForm({ ...emptyLearning });
  };

  const handleLearningChange = (event) => {
    const { name, value, checked, type } = event.target;

    setLearningForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : name === "sort_order"
            ? value === ""
              ? 0
              : Number(value)
            : value,
    }));
  };

  const handleLearningSubmit = async (event) => {
    event.preventDefault();

    const title = learningForm.title.trim();

    if (!title || learningSaving) return;

    setLearningSaving(true);
    setLearningError("");
    setLearningNotice("");

    const learningData = {
      title,
      sort_order: learningForm.sort_order,
      is_active: learningForm.is_active,
      updated_at: new Date().toISOString(),
    };

    try {
      const result =
        editingLearningId !== null
          ? await supabase
              .from("learning_items")
              .update(learningData)
              .eq("id", editingLearningId)
              .select()
          : await supabase
              .from("learning_items")
              .insert([learningData])
              .select();

      if (result.error) {
        setLearningError(result.error.message);
        return;
      }

      if (!result.data || result.data.length === 0) {
        setLearningError(
          "Learning item save nahi hui. Admin login aur Supabase RLS policies check karein."
        );
        return;
      }

      const wasEditing = editingLearningId !== null;
      const refreshed = await loadLearningItems();

      setLearningNotice(
        refreshed
          ? wasEditing
            ? "Learning item successfully update ho gayi."
            : "Learning item successfully add ho gayi."
          : "Item save ho gayi, lekin list refresh nahi ho saki."
      );

      setShowLearningForm(false);
      setEditingLearningId(null);
      setLearningForm({ ...emptyLearning });
    } catch (err) {
      setLearningError(
        err.message || "Unexpected error occurred."
      );
    } finally {
      setLearningSaving(false);
    }
  };

  const handleDeleteLearning = async (item) => {
    if (
      !window.confirm(
        `Kya aap "${item.title}" ko permanently delete karna chahte hain?`
      )
    ) {
      return;
    }

    setLearningError("");
    setLearningNotice("");

    const { data, error: deleteError } = await supabase
      .from("learning_items")
      .delete()
      .eq("id", item.id)
      .select();

    if (deleteError) {
      setLearningError(deleteError.message);
      return;
    }

    if (!data || data.length === 0) {
      setLearningError(
        "Item delete nahi hui. Admin login aur delete permissions check karein."
      );
      return;
    }

    setLearningItems((previous) =>
      previous.filter((current) => current.id !== item.id)
    );

    setLearningNotice(
      `"${item.title}" successfully delete ho gayi.`
    );
  };

  // Active/Hidden status ko form khole baghair toggle karein.
  const toggleLearningStatus = async (item) => {
    setLearningError("");
    setLearningNotice("");

    const nextStatus = !item.is_active;

    const { data, error: updateError } = await supabase
      .from("learning_items")
      .update({
        is_active: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id)
      .select();

    if (updateError) {
      setLearningError(updateError.message);
      return;
    }

    if (!data || data.length === 0) {
      setLearningError(
        "Status update nahi hua. Admin permissions check karein."
      );
      return;
    }

    setLearningItems((previous) =>
      previous.map((current) =>
        current.id === item.id ? data[0] : current
      )
    );

    setLearningNotice(
      `"${item.title}" ab ${nextStatus ? "Active" : "Hidden"} hai.`
    );
  };

  // --------------------------------------------------
  // PAGE UI
  // --------------------------------------------------

  return (
    <section className="admin-skills">
      {/* ==========================================
          SECTION 1: SKILLS MANAGEMENT
      ========================================== */}

      <div className="admin-skills-heading">
        <div>
          <span className="admin-eyebrow">PORTFOLIO CONTENT</span>
          <h2>Skills Management</h2>
          <p>Apni technical skills aur categories manage karein.</p>
        </div>

        <button
          type="button"
          className="admin-primary-button admin-skill-add"
          onClick={openAddForm}
        >
          <FiPlus size={17} />
          Add New Skill
        </button>
      </div>

      <div className="admin-skill-summary">
        <div>
          <span>Total Skills</span>
          <strong>{skills.length}</strong>
        </div>

        <div>
          <span>Featured Skills</span>
          <strong>
            {skills.filter((skill) => skill.featured).length}
          </strong>
        </div>

        <div>
          <span>Categories Used</span>
          <strong>
            {new Set(skills.map((skill) => skill.category)).size}
          </strong>
        </div>
      </div>

      <div className="admin-skill-toolbar">
        <label className="admin-skill-search">
          <FiSearch size={17} />
          <input
            type="search"
            placeholder="Search skills..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="admin-skill-category-filters">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={categoryFilter === category ? "active" : ""}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}

      {notice && (
        <p role="status" style={{ color: "#22c55e" }}>
          {notice}
        </p>
      )}

      {loading ? (
        <div className="admin-skill-empty">
          <p>Skills load ho rahi hain...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="admin-skill-empty">
          <FiCode size={32} />

          <h3>
            {skills.length === 0
              ? "No skills added yet"
              : "No matching skills found"}
          </h3>

          <p>
            {skills.length === 0
              ? "Apni pehli skill add karke shuru karein."
              : "Search ya category filter change karke dobara try karein."}
          </p>

          {skills.length === 0 && (
            <button
              type="button"
              className="admin-primary-button"
              onClick={openAddForm}
            >
              <FiPlus size={16} />
              Add Your First Skill
            </button>
          )}
        </div>
      ) : (
        <div className="admin-skills-grid">
          {filteredSkills.map((skill) => (
            <article className="admin-skill-card" key={skill.id}>
              <div className="admin-skill-card-top">
                <div
                  className="admin-skill-icon"
                  style={{ color: skill.color || "#61dafb" }}
                >
                  {getSkillIcon(skill.icon_key)}
                </div>

                <div>
                  {skill.featured && (
                    <span className="admin-skill-featured">
                      <FiStar size={12} />
                      Featured
                    </span>
                  )}

                  <span
                    style={{
                      display: "block",
                      marginTop: "6px",
                      fontSize: "12px",
                      color: skill.is_active ? "#22c55e" : "#f59e0b",
                    }}
                  >
                    {skill.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>

              <h3>{skill.name}</h3>
              <p className="admin-skill-category">{skill.category}</p>

              <div className="admin-skill-card-footer">
                <span>{skill.level}</span>

                <div className="admin-skill-actions">
                  <button
                    type="button"
                    onClick={() => openEditForm(skill)}
                    title="Edit skill"
                    aria-label={`Edit ${skill.name}`}
                  >
                    <FiEdit2 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(skill)}
                    title="Delete skill"
                    aria-label={`Delete ${skill.name}`}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: "12px", opacity: 0.7 }}>
                Display order: {skill.sort_order ?? 0}
              </p>
            </article>
          ))}
        </div>
      )}

      <p className="admin-data-notice">
        Skills Supabase database se load aur save hoti hain.
      </p>

      {/* ==========================================
          SECTION 2: CURRENTLY LEARNING
      ========================================== */}

      <div
        className="admin-skills-heading"
        style={{ marginTop: "48px" }}
      >
        <div>
          <span className="admin-eyebrow">PORTFOLIO CONTENT</span>
          <h2>Currently Learning</h2>
          <p>
            Apne learning topics manage karein jo public portfolio
            par show honge.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button admin-skill-add"
          onClick={openAddLearningForm}
        >
          <FiPlus size={17} />
          Add Learning Item
        </button>
      </div>

      <div className="admin-skill-summary">
        <div>
          <span>Total Items</span>
          <strong>{learningItems.length}</strong>
        </div>

        <div>
          <span>Active Items</span>
          <strong>
            {learningItems.filter((item) => item.is_active).length}
          </strong>
        </div>

        <div>
          <span>Hidden Items</span>
          <strong>
            {learningItems.filter((item) => !item.is_active).length}
          </strong>
        </div>
      </div>

      <div className="admin-skill-toolbar">
        <label className="admin-skill-search">
          <FiSearch size={17} />
          <input
            type="search"
            placeholder="Search learning items..."
            value={learningSearch}
            onChange={(event) => setLearningSearch(event.target.value)}
          />
        </label>

        <div className="admin-skill-category-filters">
          {["All", "Active", "Hidden"].map((status) => (
            <button
              type="button"
              key={status}
              className={learningFilter === status ? "active" : ""}
              onClick={() => setLearningFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {learningError && (
        <p role="alert" style={{ color: "#ef4444" }}>
          {learningError}
        </p>
      )}

      {learningNotice && (
        <p role="status" style={{ color: "#22c55e" }}>
          {learningNotice}
        </p>
      )}

      {learningLoading ? (
        <div className="admin-skill-empty">
          <p>Learning items load ho rahe hain...</p>
        </div>
      ) : filteredLearningItems.length === 0 ? (
        <div className="admin-skill-empty">
          <FiBookOpen size={32} />

          <h3>
            {learningItems.length === 0
              ? "No learning items added yet"
              : "No matching learning items found"}
          </h3>

          <p>
            {learningItems.length === 0
              ? "Apna pehla learning topic add karke shuru karein."
              : "Search ya status filter change karke dobara try karein."}
          </p>

          {learningItems.length === 0 && (
            <button
              type="button"
              className="admin-primary-button"
              onClick={openAddLearningForm}
            >
              <FiPlus size={16} />
              Add Your First Item
            </button>
          )}
        </div>
      ) : (
        <div className="admin-skills-grid">
          {filteredLearningItems.map((item) => (
            <article className="admin-skill-card" key={item.id}>
              <div className="admin-skill-card-top">
                <div className="admin-skill-icon">
                  <FiBookOpen size={21} />
                </div>

                <span
                  style={{
                    fontSize: "12px",
                    color: item.is_active ? "#22c55e" : "#f59e0b",
                  }}
                >
                  {item.is_active ? "Active" : "Hidden"}
                </span>
              </div>

              <h3>{item.title}</h3>

              <p className="admin-skill-category">
                Currently Learning
              </p>

              <div className="admin-skill-card-footer">
                <span>
                  Order: {item.sort_order ?? 0}
                </span>

                <div className="admin-skill-actions">
                  <button
                    type="button"
                    onClick={() => toggleLearningStatus(item)}
                    title={item.is_active ? "Hide item" : "Show item"}
                    aria-label={
                      item.is_active
                        ? `Hide ${item.title}`
                        : `Show ${item.title}`
                    }
                  >
                    {item.is_active ? (
                      <FiEyeOff size={15} />
                    ) : (
                      <FiEye size={15} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditLearningForm(item)}
                    title="Edit learning item"
                    aria-label={`Edit ${item.title}`}
                  >
                    <FiEdit2 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteLearning(item)}
                    title="Delete learning item"
                    aria-label={`Delete ${item.title}`}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="admin-data-notice">
        Currently Learning items Supabase ke learning_items table
        se manage hote hain. Hidden items public portfolio par
        show nahi hone chahiye.
      </p>

      {/* ==========================================
          SKILL ADD / EDIT MODAL
      ========================================== */}

      {showForm && (
        <div
          className="admin-skill-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            className="admin-skill-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-skill-modal-title"
          >
            <div className="admin-skill-modal-heading">
              <div>
                <span className="admin-eyebrow">SKILL DETAILS</span>
                <h2 id="admin-skill-modal-title">
                  {editingId !== null ? "Edit Skill" : "Add New Skill"}
                </h2>
              </div>

              <button
                type="button"
                className="admin-skill-close"
                onClick={closeForm}
                aria-label="Close form"
                disabled={saving}
              >
                <FiX size={20} />
              </button>
            </div>

            <form className="admin-skill-form" onSubmit={handleSubmit}>
              <label>
                Skill name *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. React.js"
                  maxLength={80}
                  required
                />
              </label>

              <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories
                    .filter((category) => category !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Current level
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                >
                  <option>Learning</option>
                  <option>Basic</option>
                  <option>Intermediate</option>
                  <option>Proficient</option>
                </select>
              </label>

              <label>
                Skill icon
                <select
                  name="icon_key"
                  value={form.icon_key}
                  onChange={handleChange}
                >
                  {Object.keys(skillIcons).map((iconKey) => (
                    <option key={iconKey} value={iconKey}>
                      {iconKey}
                    </option>
                  ))}
                </select>
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <label style={{ flex: "1 1 180px" }}>
                  Icon color
                  <input
                    type="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "42px",
                      marginTop: "6px",
                      cursor: "pointer",
                    }}
                  />
                </label>

                <div
                  aria-label="Selected icon preview"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    border: "1px solid #444",
                    color: form.color,
                  }}
                >
                  {getSkillIcon(form.icon_key)}
                </div>
              </div>

              <label>
                Display order
                <input
                  type="number"
                  name="sort_order"
                  value={form.sort_order}
                  onChange={handleChange}
                  min="0"
                  step="1"
                />
              </label>

              <label className="admin-skill-featured-toggle">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                Feature this skill on the portfolio
              </label>

              <label className="admin-skill-featured-toggle">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                Show this skill on the public portfolio
              </label>

              <div className="admin-skill-form-actions">
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
                      : "Add Skill"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* ==========================================
          CURRENTLY LEARNING ADD / EDIT MODAL
      ========================================== */}

      {showLearningForm && (
        <div
          className="admin-skill-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLearningForm();
            }
          }}
        >
          <section
            className="admin-skill-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-learning-modal-title"
          >
            <div className="admin-skill-modal-heading">
              <div>
                <span className="admin-eyebrow">LEARNING DETAILS</span>
                <h2 id="admin-learning-modal-title">
                  {editingLearningId !== null
                    ? "Edit Learning Item"
                    : "Add Learning Item"}
                </h2>
              </div>

              <button
                type="button"
                className="admin-skill-close"
                onClick={closeLearningForm}
                aria-label="Close learning form"
                disabled={learningSaving}
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              className="admin-skill-form"
              onSubmit={handleLearningSubmit}
            >
              <label>
                Learning topic *
                <input
                  name="title"
                  value={learningForm.title}
                  onChange={handleLearningChange}
                  placeholder="e.g. Advanced React"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Display order
                <input
                  type="number"
                  name="sort_order"
                  value={learningForm.sort_order}
                  onChange={handleLearningChange}
                  min="0"
                  step="1"
                />
              </label>

              <label className="admin-skill-featured-toggle">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={learningForm.is_active}
                  onChange={handleLearningChange}
                />
                Show this item on the public portfolio
              </label>

              <div className="admin-skill-form-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeLearningForm}
                  disabled={learningSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={learningSaving}
                >
                  {learningSaving
                    ? "Saving..."
                    : editingLearningId !== null
                      ? "Save Changes"
                      : "Add Learning Item"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

export default AdminSkills;
