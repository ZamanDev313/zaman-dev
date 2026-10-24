
import React, { useEffect, useState } from "react";
import {
  FaAward,
  FaCalendarAlt,
  FaGraduationCap,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import "../../styles/portfolio/Certifications.css";

export default function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCertifications() {
      try {
        const { data, error: fetchError } = await supabase
          .from("education")
          .select(
            "id, type, title, institution, period, description, status, sort_order, certificate_image_url"
          )
          .in("type", ["Certification", "Course"])
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true });

        if (fetchError) throw fetchError;

        if (isMounted) {
          setCertifications(data || []);
        }
      } catch (err) {
        console.error("Certifications fetch error:", err);

        if (isMounted) {
          setError("Certifications could not be loaded.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCertifications();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="certifications-page">
      <div className="certifications-container">
        <header className="certifications-header">
          <span className="certifications-eyebrow">
            MY PROFESSIONAL DEVELOPMENT
          </span>

          <h1>
            Certifications <span>&amp; Training</span>
          </h1>

          <p>
            Professional training and technical skills that support
            my continuous learning and web development journey.
          </p>
        </header>

        {loading ? (
          <p role="status">Loading certifications...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : certifications.length === 0 ? (
          <p>No certifications or training records available.</p>
        ) : (
          <section className="certifications-grid">
            {certifications.map((item) => (
              <article
                className="certification-card"
                key={item.id}
              >
                <div className="certification-card-icon">
                  <FaAward />
                </div>

                <span className="certification-type">
                  {item.type === "Course"
                    ? "Training Course"
                    : item.type}
                </span>

                <h2>{item.title}</h2>

                <h3>
                  <FaGraduationCap />
                  {item.institution}
                </h3>

                {item.period && (
                  <p className="certification-period">
                    <FaCalendarAlt />
                    {item.period}
                  </p>
                )}

                {item.description && (
                  <p className="certification-description">
                    {item.description}
                  </p>
                )}

                {item.status && (
                  <span className="certification-status">
                    {item.status}
                  </span>
                )}

                {item.certificate_image_url && (
                  <div className="certification-image-section">
                    <a
                      className="certification-image-link"
                      href={item.certificate_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View certificate for ${item.title}`}
                    >
                      <img
                        className="certification-image"
                        src={item.certificate_image_url}
                        alt={`${item.title} certificate`}
                        loading="lazy"
                      />
                    </a>

                    <a
                      className="certification-view-button"
                      href={item.certificate_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt />
                      View Certificate
                    </a>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
