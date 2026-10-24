
import React, { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaSchool,
  FaBook,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import "../../styles/portfolio/Education.css";

const educationIcons = [FaUserGraduate, FaSchool, FaBook];

export default function Eduaction() {
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchEducation() {
      try {
        const { data, error: fetchError } = await supabase
          .from("education")
          .select(
            "id, title, institution, period, description, location, status, sort_order"
          )
          .eq("type", "Degree")
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true });

        if (fetchError) throw fetchError;

        if (isMounted) {
          setEducationData(data || []);
        }
      } catch (err) {
        console.error("Education fetch error:", err);

        if (isMounted) {
          setError("Education information could not be loaded.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchEducation();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="education-page">
      <div className="education-container">
        <header className="education-header">
          <span className="education-eyebrow">MY BACKGROUND</span>

          <h1>
            My <span>Education</span>
          </h1>

          <p>
            My academic journey and the foundation that continues
            to support my growth in technology and web development.
          </p>
        </header>

        {loading && (
          <p role="status">Loading education...</p>
        )}

        {!loading && error && (
          <p role="alert">{error}</p>
        )}

        {!loading && !error && educationData.length === 0 && (
          <p>No education records are available yet.</p>
        )}

        {!loading && !error && educationData.length > 0 && (
          <section
            className="education-timeline"
            aria-label="Education history"
          >
            {educationData.map((edu, index) => {
              const Icon =
                educationIcons[index] || FaGraduationCap;

              return (
                <article
                  className={`education-item ${
                    index % 2 === 0
                      ? "education-left"
                      : "education-right"
                  }`}
                  key={edu.id}
                >
                  <div
                    className="education-marker"
                    aria-hidden="true"
                  >
                    <Icon />
                  </div>

                  <div className="education-card">
                    <div className="education-card-top">
                      <span className="education-card-icon">
                        <Icon />
                      </span>

                      <span className="education-status">
                        {edu.status}
                      </span>
                    </div>

                    <h2>{edu.title}</h2>
                    <h3>{edu.institution}</h3>

                    <div className="education-meta">
                      <span>
                        <FaCalendarAlt aria-hidden="true" />
                        {edu.period || "Not specified"}
                      </span>

                      <span>
                        <FaMapMarkerAlt aria-hidden="true" />
                        {edu.location || "Not specified"}
                      </span>
                    </div>

                    {edu.description && (
                      <p className="education-description">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <section className="education-note">
          <span className="education-note-icon">
            <FaGraduationCap />
          </span>

          <div>
            <h2>Learning Beyond the Classroom</h2>
            <p>
              Alongside my academic background, I have gained practical
              experience through frontend development, responsive
              website implementation, and working with web technologies.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
