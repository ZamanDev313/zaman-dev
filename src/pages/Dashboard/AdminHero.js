
import React, { useEffect, useState } from "react";
import { FiMonitor, FiSave, FiEye } from "react-icons/fi";
import { supabase } from "../../supabaseClient";

const initialHero = {
  id: null,
  eyebrow: "",
  greeting: "",
  fullName: "",
  professionalTitle: "",
  description: "",
  primaryButtonText: "",
  primaryButtonLink: "",
  resumeButtonText: "",
  resumeUrl: "",
  availabilityText: "",
  isActive: true,
};

function mapDatabaseToHero(row) {
  return {
    id: row.id,
    eyebrow: row.eyebrow ?? "",
    greeting: row.greeting ?? "",
    fullName: row.full_name ?? "",
    professionalTitle: row.professional_title ?? "",
    description: row.description ?? "",
    primaryButtonText: row.primary_button_text ?? "",
    primaryButtonLink: row.primary_button_link ?? "",
    resumeButtonText: row.resume_button_text ?? "",
    resumeUrl: row.resume_url ?? "",
    availabilityText: row.availability_text ?? "",
    isActive: row.is_active ?? true,
  };
}

function AdminHero() {
  const [hero, setHero] = useState(initialHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadHero() {
      setLoading(true);
      setError("");

      try {
        const { data, error: fetchError } = await supabase
          .from("home_content")
          .select("*")
          .eq("is_active", true)
          .order("id", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          throw new Error(
            "Koi active homepage content nahi mila. Supabase table check karein."
          );
        }

        if (isMounted) {
          setHero(mapDatabaseToHero(data));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Homepage content load nahi ho saka.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHero();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setHero((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    if (!hero.id) {
      setError("Content ID nahi mili. Pehle content reload karein.");
      setSaving(false);
      return;
    }

    try {
      const { data, error: updateError } = await supabase
        .from("home_content")
        .update({
          eyebrow: hero.eyebrow,
          greeting: hero.greeting,
          full_name: hero.fullName,
          professional_title: hero.professionalTitle,
          description: hero.description,
          primary_button_text: hero.primaryButtonText,
          primary_button_link: hero.primaryButtonLink,
          resume_button_text: hero.resumeButtonText,
          resume_url: hero.resumeUrl || null,
          availability_text: hero.availabilityText,
          updated_at: new Date().toISOString(),
        })
        .eq("id", hero.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setHero(mapDatabaseToHero(data));
      setMessage("Changes Supabase database mein successfully save ho gayi hain.");
    } catch (err) {
      setError(
        err.message ||
          "Changes save nahi ho sakin. Login aur database permissions check karein."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-hero-page">
        <p>Homepage content load ho raha hai...</p>
      </section>
    );
  }

  return (
    <section className="admin-hero-page">
      <div className="admin-hero-heading">
        <div>
          <span className="admin-eyebrow">PORTFOLIO CONTENT</span>
          <h2>Hero Section</h2>
          <p>Homepage ki main heading aur introduction manage karein.</p>
        </div>

        <a
          className="admin-secondary-button admin-hero-view-link"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          <FiEye size={16} />
          View Portfolio
        </a>
      </div>

      <div className="admin-hero-info">
        <FiMonitor size={20} />
        <div>
          <strong>Homepage Hero Content</strong>
          <p>
            Yahan changes Supabase mein save hongi. Public homepage ko
            database se connect karna agla step hai.
          </p>
        </div>
      </div>

      <div className="admin-hero-editor">
        <form className="admin-hero-form" onSubmit={handleSubmit}>
          <h3>Content Settings</h3>

          <label>
            Small heading / Eyebrow
            <input
              name="eyebrow"
              value={hero.eyebrow}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </label>

          <label>
            Greeting
            <input
              name="greeting"
              value={hero.greeting}
              onChange={handleChange}
              maxLength={80}
              required
            />
          </label>

          <label>
            Full name
            <input
              name="fullName"
              value={hero.fullName}
              onChange={handleChange}
              maxLength={120}
              required
            />
          </label>

          <label>
            Professional title
            <input
              name="professionalTitle"
              value={hero.professionalTitle}
              onChange={handleChange}
              maxLength={180}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={hero.description}
              onChange={handleChange}
              rows={4}
              maxLength={600}
              required
            />
          </label>

          <div className="admin-hero-two-columns">
            <label>
              Primary button text
              <input
                name="primaryButtonText"
                value={hero.primaryButtonText}
                onChange={handleChange}
                maxLength={40}
                required
              />
            </label>

            <label>
              Primary button link
              <input
                name="primaryButtonLink"
                value={hero.primaryButtonLink}
                onChange={handleChange}
                maxLength={200}
                required
              />
            </label>

            <label>
              Resume button text
              <input
                name="resumeButtonText"
                value={hero.resumeButtonText}
                onChange={handleChange}
                maxLength={40}
                required
              />
            </label>

            <label>
              Resume URL
              <input
                name="resumeUrl"
                type="url"
                value={hero.resumeUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>
          </div>

          <label>
            Availability message
            <input
              name="availabilityText"
              value={hero.availabilityText}
              onChange={handleChange}
              maxLength={200}
              required
            />
          </label>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={saving}
          >
            <FiSave size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {message && (
            <p className="admin-hero-message" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="admin-hero-message" role="alert">
              Error: {error}
            </p>
          )}
        </form>

        <aside className="admin-hero-live-preview">
          <span className="admin-eyebrow">LIVE PREVIEW</span>

          <div className="admin-hero-preview-content">
            <span className="admin-hero-preview-eyebrow">
              {hero.eyebrow}
            </span>

            <h2>
              {hero.greeting} {hero.fullName}
            </h2>
            <h3>{hero.professionalTitle}</h3>
            <p>{hero.description}</p>

            <div className="admin-hero-preview-buttons">
              <span>{hero.primaryButtonText}</span>
              <span>{hero.resumeButtonText}</span>
            </div>

            <p>{hero.availabilityText}</p>
          </div>

          <p className="admin-hero-preview-note">
            Ye dashboard preview hai. Live homepage integration aglay step
            mein hogi.
          </p>
        </aside>
      </div>
    </section>
  );
}

export default AdminHero;
