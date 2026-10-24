
import React, { useEffect, useState } from "react";
import { FiUser, FiSave, FiImage } from "react-icons/fi";
import { supabase } from "../../supabaseClient";

const initialProfile = {
  fullName: "Muhammad Zaman",
  professionalTitle: "Frontend Developer",
  location: "Karachi, Pakistan",
  email: "",
  shortBio: "I build responsive and user-friendly web experiences.",
  about:
    "I am a Computer Science graduate interested in frontend development. I enjoy converting Figma designs into responsive websites and working with HTML, CSS, JavaScript, React, WordPress and Shopify.",
  secondParagraph:
    "During my five-month frontend development internship, I worked on converting Figma designs into custom HTML, CSS, and JavaScript, along with WordPress, Shopify, website testing, and basic SEO tasks. I am continuously improving my React skills and expanding my knowledge of modern web technologies.",
  profileImage: "/myprofileimage.jpeg",
  quote:
    "Every project is an opportunity to learn something new, solve a problem, and build something better.",
  skillsText: "HTML & CSS, JavaScript, React, WordPress, Shopify",
  contactButtonText: "Let's Connect",
  contactButtonLink: "/contact",
  resumeButtonText: "View Resume",
  resumeButtonLink: "/resume.html",
};

function AdminProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("about_content")
          .select("*")
          .order("id", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (cancelled) return;

        if (data) {
          setRecordId(data.id);

          setProfile({
            fullName: data.full_name ?? initialProfile.fullName,
            professionalTitle:
              data.professional_title ??
              initialProfile.professionalTitle,
            location: data.location ?? "",
            email: data.email ?? "",
            shortBio: data.short_bio ?? "",
            about: data.about_text ?? "",
            secondParagraph:
              data.second_paragraph ??
              initialProfile.secondParagraph,
            profileImage:
              data.profile_image_url ??
              initialProfile.profileImage,
            quote: data.quote ?? "",
            skillsText: Array.isArray(data.skills)
              ? data.skills.join(", ")
              : initialProfile.skillsText,
            contactButtonText:
              data.contact_button_text ??
              initialProfile.contactButtonText,
            contactButtonLink:
              data.contact_button_link ??
              initialProfile.contactButtonLink,
            resumeButtonText:
              data.resume_button_text ??
              initialProfile.resumeButtonText,
            resumeButtonLink:
              data.resume_button_link ??
              initialProfile.resumeButtonLink,
          });
        } else {
          setMessage(
            "About record nahi mila. Save karne par naya record banega."
          );
          setMessageType("error");
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(`Data load nahi hua: ${error.message}`);
          setMessageType("error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setMessageType("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setMessageType("");

    const skills = profile.skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const payload = {
      full_name: profile.fullName.trim(),
      professional_title: profile.professionalTitle.trim(),
      location: profile.location.trim(),
      email: profile.email.trim(),
      short_bio: profile.shortBio.trim(),
      about_text: profile.about.trim(),
      second_paragraph: profile.secondParagraph.trim(),
      profile_image_url: profile.profileImage.trim(),
      quote: profile.quote.trim(),
      skills,
      contact_button_text: profile.contactButtonText.trim(),
      contact_button_link: profile.contactButtonLink.trim(),
      resume_button_text: profile.resumeButtonText.trim(),
      resume_button_link: profile.resumeButtonLink.trim(),
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    try {
      let result;

      if (recordId !== null) {
        result = await supabase
          .from("about_content")
          .update(payload)
          .eq("id", recordId)
          .select()
          .single();
      } else {
        result = await supabase
          .from("about_content")
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setRecordId(result.data.id);
      setMessage("About profile successfully Supabase mein save ho gaya!");
      setMessageType("success");
    } catch (error) {
      setMessage(`Save failed: ${error.message}`);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-profile-page">
      <div className="admin-profile-heading">
        <div>
          <span className="admin-eyebrow">PORTFOLIO CONTENT</span>
          <h2>Profile & About</h2>
          <p>
            Apni professional information aur About section manage karein.
          </p>
        </div>
      </div>

      {loading && (
        <p role="status">Supabase se profile load ho rahi hai...</p>
      )}

      <div className="admin-profile-layout">
        <form className="admin-profile-form" onSubmit={handleSubmit}>
          <div className="admin-profile-form-heading">
            <div className="admin-profile-heading-icon">
              <FiUser size={20} />
            </div>
            <div>
              <h3>Personal Information</h3>
              <p>Apni public professional details update karein.</p>
            </div>
          </div>

          <label>
            Full name *
            <input
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </label>

          <label>
            Professional title *
            <input
              name="professionalTitle"
              value={profile.professionalTitle}
              onChange={handleChange}
              maxLength={120}
              required
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={profile.location}
              onChange={handleChange}
              maxLength={120}
            />
          </label>

          <label>
            Public contact email
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              maxLength={254}
              placeholder="Your professional email"
            />
          </label>

          <label>
            Short bio
            <textarea
              name="shortBio"
              value={profile.shortBio}
              onChange={handleChange}
              rows={3}
              maxLength={300}
            />
          </label>

          <label>
            About me — first paragraph
            <textarea
              name="about"
              value={profile.about}
              onChange={handleChange}
              rows={6}
              maxLength={2000}
            />
          </label>

          <label>
            About me — second paragraph
            <textarea
              name="secondParagraph"
              value={profile.secondParagraph}
              onChange={handleChange}
              rows={6}
              maxLength={2000}
            />
          </label>

          <label>
            Profile image URL or public path
            <input
              name="profileImage"
              value={profile.profileImage}
              onChange={handleChange}
              maxLength={1000}
              placeholder="/myprofileimage.jpeg or https://..."
            />
          </label>

          <label>
            About quote
            <textarea
              name="quote"
              value={profile.quote}
              onChange={handleChange}
              rows={3}
              maxLength={500}
            />
          </label>

          <label>
            Skills badges — comma-separated
            <textarea
              name="skillsText"
              value={profile.skillsText}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
              placeholder="HTML & CSS, JavaScript, React"
            />
          </label>
          <p>
            <small>
              Har skill ko comma se separate karein. Example: HTML & CSS,
              JavaScript, React, Shopify
            </small>
          </p>

          <div className="admin-profile-form-heading">
            <div className="admin-profile-heading-icon">
              <FiImage size={20} />
            </div>
            <div>
              <h3>About Page Buttons</h3>
              <p>Buttons ka text aur destination update karein.</p>
            </div>
          </div>

          <label>
            Contact button text
            <input
              name="contactButtonText"
              value={profile.contactButtonText}
              onChange={handleChange}
              maxLength={80}
            />
          </label>

          <label>
            Contact button link
            <input
              name="contactButtonLink"
              value={profile.contactButtonLink}
              onChange={handleChange}
              maxLength={1000}
              placeholder="/contact"
            />
          </label>

          <label>
            Resume button text
            <input
              name="resumeButtonText"
              value={profile.resumeButtonText}
              onChange={handleChange}
              maxLength={80}
            />
          </label>

          <label>
            Resume button link
            <input
              name="resumeButtonLink"
              value={profile.resumeButtonLink}
              onChange={handleChange}
              maxLength={1000}
              placeholder="/resume.html"
            />
          </label>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={loading || saving}
          >
            <FiSave size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {message && (
            <p
              className="admin-profile-message"
              role="status"
              aria-live="polite"
              style={{
                color: messageType === "error" ? "#f87171" : "#4ade80",
              }}
            >
              {message}
            </p>
          )}
        </form>

        <aside className="admin-profile-preview">
          <span className="admin-eyebrow">PROFILE PREVIEW</span>

          <div className="admin-profile-avatar">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.fullName || "Profile"}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <FiUser size={38} />
            )}
          </div>

          <h3>{profile.fullName || "Your Name"}</h3>

          <p className="admin-profile-preview-title">
            {profile.professionalTitle || "Your Professional Title"}
          </p>

          {profile.location && (
            <p className="admin-profile-preview-location">
              {profile.location}
            </p>
          )}

          {profile.email && (
            <p className="admin-profile-preview-email">
              {profile.email}
            </p>
          )}

          <div className="admin-profile-preview-divider" />

          <h4>Short Bio</h4>
          <p className="admin-profile-preview-bio">
            {profile.shortBio || "Your short bio will appear here."}
          </p>

          <h4>About Me</h4>
          <p className="admin-profile-preview-about">
            {profile.about || "Your first paragraph will appear here."}
          </p>
          <p className="admin-profile-preview-about">
            {profile.secondParagraph}
          </p>

          <h4>Quote</h4>
          <p>{profile.quote}</p>

          <h4>Skills</h4>
          <div className="admin-profile-preview-skills">
            {profile.skillsText
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
              .map((skill, index) => (
                <span key={`${skill}-${index}`}>{skill}</span>
              ))}
          </div>

          <p>
            <strong>{profile.contactButtonText}</strong>
            {" · "}
            <strong>{profile.resumeButtonText}</strong>
          </p>

          <p className="admin-profile-preview-note">
            {loading
              ? "Profile load ho rahi hai..."
              : "Save Changes se information Supabase mein save hogi."}
          </p>
        </aside>
      </div>
    </section>
  );
}

export default AdminProfile;
