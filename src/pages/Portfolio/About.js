
import React, { useEffect, useState } from "react";
import {
  FaCode,
  FaArrowRight,
} from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import "../../styles/portfolio/About.css";

const defaultAbout = {
  full_name: "Muhammad Zaman",
  professional_title: "Junior Frontend Developer",
  short_bio:
    "A passionate developer focused on building modern, responsive, and user-friendly web experiences.",
  about_text:
    "I'm a Computer Science graduate from Federal Urdu University of Arts, Science & Technology, Karachi, with practical experience in frontend development. I enjoy transforming design concepts into responsive websites that look good and work smoothly across devices.",
  second_paragraph:
    "During my five-month frontend development internship, I worked on converting Figma designs into custom HTML, CSS, and JavaScript, along with WordPress, Shopify, website testing, and basic SEO tasks. I'm continuously improving my React skills and expanding my knowledge of modern web technologies.",
  profile_image_url: "/myprofileimage.jpeg",
  quote:
    "Every project is an opportunity to learn something new, solve a problem, and build something better.",
  skills: ["HTML & CSS", "JavaScript", "React", "WordPress", "Shopify"],
  contact_button_text: "Let's Connect",
  contact_button_link: "/contact",
  resume_button_text: "View Resume",
  resume_button_link: "/resume.html",
};

export default function About() {
  const [about, setAbout] = useState(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAbout() {
      try {
        const { data, error } = await supabase
          .from("about_content")
          .select("*")
          .eq("is_active", true)
          .order("id", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (!cancelled && data) {
          setAbout((previous) => ({
            ...previous,
            ...data,
            skills: Array.isArray(data.skills)
              ? data.skills
              : previous.skills,
          }));
        }
      } catch (error) {
        console.error("About content load error:", error.message);

        if (!cancelled) {
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchAbout();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-container">
          <div className="about-heading">
            <span className="about-eyebrow">
              <span className="about-status-dot" />
              GET TO KNOW ME
            </span>

            <h1>
              About <span>Me.</span>
            </h1>

            <p>{about.short_bio}</p>
          </div>

          {loading && (
            <p className="about-description" role="status">
              Loading About information...
            </p>
          )}

          {loadError && (
            <p className="about-description" role="status">
              Latest information load nahi ho saki. Available profile content
              display kiya ja raha hai.
            </p>
          )}

          <div className="about-intro">
            <div className="about-visual">
              <div className="about-image-glow" />

              <div className="about-image-frame">
                <img
                  src={about.profile_image_url || "/myprofileimage.jpeg"}
                  alt={`${about.full_name}, ${about.professional_title}`}
                  className="about-profile-image"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/myprofileimage.jpeg";
                  }}
                />

                <div className="about-image-caption">
                  <span className="about-caption-icon">
                    <FaCode />
                  </span>
                  <div>
                    <strong>{about.full_name}</strong>
                    <span>{about.professional_title}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-content">
              <span className="about-section-label">MY INTRODUCTION</span>

              <h2>
                Hello, I'm <span>{about.full_name}</span>
              </h2>

              <p className="about-description">
                {about.about_text}
              </p>

              {about.second_paragraph && (
                <p className="about-description">
                  {about.second_paragraph}
                </p>
              )}

              <div className="about-quote">
                <span className="about-quote-mark">“</span>
                <p>{about.quote}</p>
              </div>

              <div className="about-tags">
                {(Array.isArray(about.skills) ? about.skills : []).map(
                  (skill, index) => (
                    <span key={`${skill}-${index}`}>{skill}</span>
                  )
                )}
              </div>

              <div className="about-actions">
                <a
                  className="about-btn about-btn-primary"
                  href={about.contact_button_link || "/contact"}
                >
                  {about.contact_button_text || "Let's Connect"}{" "}
                  <FaArrowRight />
                </a>

                <a
                  className="about-btn about-btn-secondary"
                  href={about.resume_button_link || "/resume.html"}
                  target="_blank"
                  rel="noreferrer"
                >
                  {about.resume_button_text || "View Resume"}{" "}
                  <FaArrowRight />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
