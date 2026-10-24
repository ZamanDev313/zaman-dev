import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FiPlus,
  FiBookOpen,
  FiAward,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import { supabase } from "../../supabaseClient";
import { useAdminToast } from "./AdminToast";

const STORAGE_BUCKET = "certificates";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const emptyForm = {
  type: "Certification",
  title: "",
  institution: "",
  period: "",
  description: "",
  location: "",
  status: "Completed",
  responsibilities: [],
  technologies: [],
  achievement: "",
};

const emptyResponsibility = { title: "", description: "" };

const defaultInternshipResponsibilities = [
  {
    title: "Figma to Custom Code",
    description:
      "Converted Figma designs into responsive websites using HTML, CSS, and JavaScript.",
  },
  {
    title: "WordPress Development",
    description: "Implemented website designs in WordPress.",
  },
  {
    title: "Shopify Website Work",
    description: "Worked on a Shopify reference website.",
  },
  {
    title: "Website SEO",
    description: "Worked on website SEO-related tasks.",
  },
  {
    title: "Quality Assurance",
    description: "Reviewed website layouts and checked functionality.",
  },
  {
    title: "Website Preview & Tracking",
    description: "Previewed 4 of 8 websites and used the Upwork timer.",
  },
];

const defaultTechnologies = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "Figma",
  "WordPress",
  "Shopify",
  "Website QA",
  "SEO",
];

const getFileExtension = (file) => {
  const nameParts = file.name.split(".");
  const extension =
    nameParts.length > 1 ? nameParts.pop().toLowerCase() : "";

  return /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
};

function AdminEducation() {
  const { showToast } = useAdminToast();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificateImageUrl, setCertificateImageUrl] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const fileInputRef = useRef(null);

  const clearImagePreview = useCallback(() => {
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl && currentUrl.startsWith("blob:")) {
        URL.revokeObjectURL(currentUrl);
      }

      return "";
    });
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (fetchError) {
      setError(`Records load nahi ho sake: ${fetchError.message}`);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const filteredItems = items.filter((item) =>
    `${item.title || ""} ${item.institution || ""} ${item.type || ""}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const resetForm = () => {
    clearImagePreview();
    setCertificateFile(null);
    setCertificateImageUrl("");
    setForm({ ...emptyForm });
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    resetForm();
  };

  const openAddModal = () => {
    setError("");
    setNotice("");
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setError("");
    setNotice("");
    clearImagePreview();

    setEditingId(item.id);

    setForm({
      type: item.type || "Certification",
      title: item.title || "",
      institution: item.institution || "",
      period: item.period || "",
      description: item.description || "",
      location: item.location || "",
      status: item.status || "Completed",
      responsibilities: Array.isArray(item.responsibilities)
        ? item.responsibilities
        : [],
      technologies: Array.isArray(item.technologies)
        ? item.technologies
        : [],
      achievement: item.achievement || "",
    });

    setCertificateFile(null);
    setCertificateImageUrl(item.certificate_image_url || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      if (name === "type" && value === "Internship") {
        return {
          ...previous,
          type: value,
          responsibilities:
            previous.responsibilities.length > 0
              ? previous.responsibilities
              : defaultInternshipResponsibilities.map((item) => ({
                  ...item,
                })),
          technologies:
            previous.technologies.length > 0
              ? previous.technologies
              : [...defaultTechnologies],
          achievement:
            previous.achievement ||
            "Five months of hands-on experience in frontend development, WordPress, Shopify, website SEO, and QA.",
        };
      }

      return { ...previous, [name]: value };
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      showToast(
        "Sirf PNG, JPG/JPEG ya WEBP image select karein.",
        "error"
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      showToast("Image ka size 5 MB se kam hona chahiye.", "error");
      event.target.value = "";
      return;
    }

    clearImagePreview();
    setCertificateFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };


    const uploadCertificateImage = async (file, recordId) => {
    const extension = getFileExtension(file);
    const safeName = `${Date.now()}-${recordId}.${extension}`;
    const filePath = `education/${safeName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      throw new Error(
        `Storage upload fail hua (${STORAGE_BUCKET}): ${uploadError.message}`
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      throw new Error(
        "Image upload ho gayi, lekin public URL generate nahi hua."
      );
    }

    return publicUrl;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.institution.trim()) {
      showToast("Title aur institution dono fill karein.", "error");
      return;
    }

    if (
      form.type === "Certification" &&
      !certificateFile &&
      !certificateImageUrl
    ) {
      showToast(
        "Certification ke liye certificate image select karein.",
        "error"
      );
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        type: form.type,
        title: form.title.trim(),
        institution: form.institution.trim(),
        period: form.period.trim() || null,
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        status: form.status.trim() || "Completed",
        responsibilities:
          form.type === "Internship"
            ? form.responsibilities.filter(
                (item) => item.title.trim() && item.description.trim()
              )
            : [],
        technologies:
          form.type === "Internship"
            ? form.technologies.map((item) => item.trim()).filter(Boolean)
            : [],
        achievement:
          form.type === "Internship"
            ? form.achievement.trim() || null
            : null,
      };

      let savedRecord;

      if (editingId !== null) {
        const { data, error: updateError } = await supabase
          .from("education")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId)
          .select()
          .single();

        if (updateError) {
          throw new Error(
            `Record update fail hua: ${updateError.message}`
          );
        }

        savedRecord = data;
      } else {
        const nextSortOrder =
          items.length > 0
            ? Math.max(
                ...items.map((item) => Number(item.sort_order) || 0)
              ) + 1
            : 1;

        const { data, error: insertError } = await supabase
          .from("education")
          .insert({
            ...payload,
            sort_order: nextSortOrder,
          })
          .select()
          .single();

        if (insertError) {
          throw new Error(
            `Record save fail hua: ${insertError.message}`
          );
        }

        savedRecord = data;
      }

      let finalImageUrl = certificateImageUrl || null;

      if (form.type === "Certification" && certificateFile) {
        finalImageUrl = await uploadCertificateImage(
          certificateFile,
          savedRecord.id
        );

        const { data: updatedRecord, error: imageSaveError } =
          await supabase
            .from("education")
            .update({
              certificate_image_url: finalImageUrl,
              updated_at: new Date().toISOString(),
            })
            .eq("id", savedRecord.id)
            .select()
            .single();

        if (imageSaveError) {
          throw new Error(
            `Image upload ho gayi, lekin URL database mein save nahi hua: ${imageSaveError.message}`
          );
        }

        savedRecord = updatedRecord;
      } else if (
        form.type !== "Certification" &&
        savedRecord.certificate_image_url
      ) {
        const { data: updatedRecord, error: clearImageError } =
          await supabase
            .from("education")
            .update({ certificate_image_url: null })
            .eq("id", savedRecord.id)
            .select()
            .single();

        if (clearImageError) {
          throw new Error(clearImageError.message);
        }

        savedRecord = updatedRecord;
      } else if (
        form.type === "Certification" &&
        !certificateImageUrl &&
        !certificateFile
      ) {
        finalImageUrl = null;
      }

      setItems((previous) => {
        const withoutSaved = previous.filter(
          (item) => item.id !== savedRecord.id
        );

        return [...withoutSaved, savedRecord].sort((a, b) => {
          const orderDifference =
            (Number(a.sort_order) || 0) -
            (Number(b.sort_order) || 0);

          return orderDifference || Number(a.id) - Number(b.id);
        });
      });

      setModalOpen(false);
      resetForm();

      showToast(
        editingId !== null
          ? "Record successfully update ho gaya."
          : "New record successfully add ho gaya.",
        "success"
      );

      await fetchItems();
    } catch (submitError) {
      const message =
        submitError?.message || "Koi unknown error aa gaya.";

      setError(message);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is record ko permanently delete karna chahte hain?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setNotice("");

    const { error: deleteError } = await supabase
      .from("education")
      .delete()
      .eq("id", id);

    if (deleteError) {
      showToast(
        `Record delete nahi hua: ${deleteError.message}`,
        "error"
      );
      setDeletingId(null);
      return;
    }

    setItems((previous) =>
      previous.filter((item) => item.id !== id)
    );

    showToast("Record successfully delete ho gaya.", "success");
    setDeletingId(null);
  };

    return (
    <section className="admin-education">
      <div className="admin-education-heading">
        <div>
          <span className="admin-page-eyebrow">PORTFOLIO CONTENT</span>
          <h1>Education & Certifications</h1>
          <p>Manage your degrees, courses and internship records.</p>
        </div>

        <button
          type="button"
          className="admin-education-add-btn"
          onClick={openAddModal}
          disabled={loading}
        >
          <FiPlus /> Add New
        </button>
      </div>

      {error && (
        <div
          className="admin-education-message admin-education-error"
          role="alert"
        >
          {error}
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <FiX />
          </button>
        </div>
      )}

      {notice && (
        <div
          className="admin-education-message admin-education-success"
          role="status"
        >
          {notice}
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            <FiX />
          </button>
        </div>
      )}

      <div className="admin-education-summary">
        <div className="admin-education-summary-card">
          <span className="admin-education-summary-icon">
            <FiBookOpen />
          </span>
          <div>
            <p>Education & Courses</p>
            <h3>
              {items.filter((item) => item.type !== "Internship").length}
            </h3>
          </div>
        </div>

        <div className="admin-education-summary-card">
          <span className="admin-education-summary-icon">
            <FiAward />
          </span>
          <div>
            <p>Internships</p>
            <h3>
              {items.filter((item) => item.type === "Internship").length}
            </h3>
          </div>
        </div>

        <div className="admin-education-summary-card">
          <span className="admin-education-summary-icon">
            <FiCalendar />
          </span>
          <div>
            <p>Total Records</p>
            <h3>{items.length}</h3>
          </div>
        </div>
      </div>

      <div className="admin-education-toolbar">
        <FiSearch />
        <input
          type="search"
          placeholder="Search education, course or institution..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search education records"
        />
      </div>

      <div className="admin-education-list">
        {loading ? (
          <div className="admin-education-empty">Loading records...</div>
        ) : (
          <>
            {filteredItems.map((item) => (
              <article className="admin-education-card" key={item.id}>
                <div className="admin-education-card-icon">
                  {item.type === "Degree" ? <FiBookOpen /> : <FiAward />}
                </div>

                <div className="admin-education-card-content">
                  <div className="admin-education-card-top">
                    <span className="admin-education-type">{item.type}</span>
                    <span className="admin-education-period">
                      {item.period || "Period not specified"}
                    </span>
                  </div>

                  <h3>{item.title}</h3>
                  <h4>{item.institution}</h4>
                  <p>{item.description || ""}</p>

                  {item.type === "Certification" &&
                    item.certificate_image_url && (
                      <a
                        href={item.certificate_image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-education-certificate-link"
                      >
                        <FiExternalLink /> View certificate image
                      </a>
                    )}

                  <div className="admin-education-actions">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      disabled={deletingId === item.id}
                    >
                      <FiEdit2 /> Edit
                    </button>

                    <button
                      type="button"
                      className="admin-education-delete"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                    >
                      <FiTrash2 />{" "}
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredItems.length === 0 && (
              <div className="admin-education-empty">
                No matching records found.
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <div
          className="admin-education-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="admin-education-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="education-modal-title"
          >
            <div className="admin-education-modal-heading">
              <div>
                <h2 id="education-modal-title">
                  {editingId !== null ? "Edit Record" : "Add New Record"}
                </h2>
                <p>Enter your education or certification details.</p>
              </div>

              <button
                type="button"
                className="admin-education-close"
                onClick={closeModal}
                aria-label="Close form"
                disabled={saving}
              >
                <FiX />
              </button>
            </div>

            <form className="admin-education-form" onSubmit={handleSubmit}>
              <label>
                Record Type
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="Degree">Degree</option>
                  <option value="Certification">Certification</option>
                  <option value="Internship">Internship</option>
                  <option value="Course">Course</option>
                </select>
              </label>

              <label>
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Bachelor of Computer Science"
                  required
                />
              </label>

              <label>
                Institution / Organization *
                <input
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  placeholder="Institution name"
                  required
                />
              </label>

              <label>
                Duration / Year
                <input
                  name="period"
                  value={form.period}
                  onChange={handleChange}
                  placeholder="e.g. 2024 or May–October 2026"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Skills, achievements or course details"
                />
              </label>

              {form.type === "Certification" && (
                <label className="admin-education-image-field">
                  <span>
                    Certificate Image (PNG, JPG, WEBP — max 5 MB)
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                  />

                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Selected certificate preview"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: "320px",
                        maxHeight: "220px",
                        objectFit: "contain",
                        marginTop: "12px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : certificateImageUrl ? (
                    <img
                      src={certificateImageUrl}
                      alt="Saved certificate"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: "320px",
                        maxHeight: "220px",
                        objectFit: "contain",
                        marginTop: "12px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <span>No certificate image selected yet.</span>
                  )}

                  {certificateImageUrl && (
                    <button
                      type="button"
                      className="admin-education-cancel"
                      onClick={() => {
                        setCertificateImageUrl("");
                        setCertificateFile(null);
                        clearImagePreview();

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <FiX /> Remove selected image
                    </button>
                  )}
                </label>
              )}

                            <label>
                Location
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Karachi, Pakistan"
                />
              </label>

              <label>
                Status
                <input
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  placeholder="e.g. Completed or Graduate"
                />
              </label>

              {form.type === "Internship" && (
                <>
                  <div className="admin-education-extra-fields">
                    <h3>Responsibilities</h3>
                    <p>Add the tasks performed during your internship.</p>

                    {form.responsibilities.map((item, index) => (
                      <div
                        className="admin-education-responsibility-form"
                        key={index}
                      >
                        <label>
                          Responsibility Title
                          <input
                            value={item.title}
                            onChange={(event) => {
                              const responsibilities = [
                                ...form.responsibilities,
                              ];

                              responsibilities[index] = {
                                ...responsibilities[index],
                                title: event.target.value,
                              };

                              setForm((previous) => ({
                                ...previous,
                                responsibilities,
                              }));
                            }}
                            placeholder="e.g. Figma to Custom Code"
                          />
                        </label>

                        <label>
                          Responsibility Description
                          <textarea
                            value={item.description}
                            onChange={(event) => {
                              const responsibilities = [
                                ...form.responsibilities,
                              ];

                              responsibilities[index] = {
                                ...responsibilities[index],
                                description: event.target.value,
                              };

                              setForm((previous) => ({
                                ...previous,
                                responsibilities,
                              }));
                            }}
                            rows={2}
                            placeholder="Describe the work performed"
                          />
                        </label>

                        <button
                          type="button"
                          className="admin-education-cancel"
                          onClick={() =>
                            setForm((previous) => ({
                              ...previous,
                              responsibilities:
                                previous.responsibilities.filter(
                                  (_, itemIndex) => itemIndex !== index
                                ),
                            }))
                          }
                        >
                          Remove responsibility
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="admin-education-cancel"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          responsibilities: [
                            ...previous.responsibilities,
                            { ...emptyResponsibility },
                          ],
                        }))
                      }
                    >
                      <FiPlus /> Add Responsibility
                    </button>
                  </div>

                  <label>
                    Technologies (comma-separated)
                    <textarea
                      value={form.technologies.join(", ")}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          technologies: event.target.value.split(","),
                        }))
                      }
                      rows={3}
                      placeholder="HTML5, CSS3, JavaScript, Figma..."
                    />
                  </label>

                  <label>
                    Achievement
                    <textarea
                      value={form.achievement}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          achievement: event.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Describe your practical experience or achievement"
                    />
                  </label>
                </>
              )}

              <div className="admin-education-form-actions">
                <button
                  type="button"
                  className="admin-education-cancel"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-education-save"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminEducation;