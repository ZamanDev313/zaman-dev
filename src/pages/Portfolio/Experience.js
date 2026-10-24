import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCode,
  FaFigma,
  FaWordpress,
  FaShopify,
  FaSearch,
  FaClipboardCheck,
  FaLaptopCode,
} from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import "../../styles/portfolio/Experience.css";

const responsibilityIcons = {
  "Figma to Custom Code": FaFigma,
  "WordPress Development": FaWordpress,
  "Shopify Website Work": FaShopify,
  "Website SEO": FaSearch,
  "Quality Assurance": FaClipboardCheck,
  "Website Preview & Tracking": FaLaptopCode,
};

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

function formatProfessionalPeriod(item) {
  const start = formatMonth(item.start_month);

  if (item.currently_working) {
    return start ? `${start} — Present` : "Present";
  }

  const end = formatMonth(item.end_month);

  if (start && end) return `${start} — ${end}`;
  return start || end || "";
}

function normalizeResponsibilities(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      title: item.title || "",
      description: item.description || "",
    }))
    .filter((item) => item.title || item.description);
}

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchExperiences() {
      try {
        const [professionalResult, internshipResult] =
          await Promise.all([
            supabase
              .from("professional_experience")
              .select(
                "id, role, company, employment_type, location, start_month, end_month, currently_working, description, responsibilities, technologies, achievement, sort_order"
              )
              .eq("is_published", true)
              .order("sort_order", { ascending: true })
              .order("id", { ascending: true }),

            supabase
              .from("education")
              .select(
                "id, title, institution, period, description, location, status, responsibilities, technologies, achievement, sort_order"
              )
              .eq("type", "Internship")
              .order("sort_order", { ascending: true })
              .order("id", { ascending: true }),
          ]);

        if (professionalResult.error) {
          throw professionalResult.error;
        }

        if (internshipResult.error) {
          throw internshipResult.error;
        }

        const professionalExperiences = (
          professionalResult.data || []
        ).map((item) => ({
          id: `professional-${item.id}`,
          category: "professional",
          title: item.role,
          institution: item.company,
          period: formatProfessionalPeriod(item),
          location: item.location,
          status: item.employment_type || "Professional Experience",
          description: item.description,
          responsibilities: normalizeResponsibilities(
            item.responsibilities
          ),
          technologies: Array.isArray(item.technologies)
            ? item.technologies
            : [],
          achievement: item.achievement,
          sort_order: item.sort_order ?? 0,
        }));

        const internships = (internshipResult.data || []).map(
          (item) => ({
            ...item,
            id: `internship-${item.id}`,
            category: "internship",
            responsibilities: normalizeResponsibilities(
              item.responsibilities
            ),
            technologies: Array.isArray(item.technologies)
              ? item.technologies
              : [],
            sort_order: item.sort_order ?? 0,
          })
        );

        const combinedExperiences = [
          ...professionalExperiences,
          ...internships,
        ].sort((a, b) => {
          const aOrder = a.sort_order ?? 0;
          const bOrder = b.sort_order ?? 0;

          return bOrder - aOrder;
        });

        if (isMounted) {
          setExperiences(combinedExperiences);
          setError("");
        }
      } catch (err) {
        console.error("Experience fetch error:", err);

        if (isMounted) {
          setError(
            "Work experience could not be loaded. Please try again later."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchExperiences();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="experience-page">
      <div className="experience-container">
        <header className="experience-header">
          <span className="experience-eyebrow">
            MY PROFESSIONAL JOURNEY
          </span>

          <h1>
            Work <span>Experience</span>
          </h1>

          <p>
            Practical experience turning design concepts into responsive
            websites, working with website platforms, and supporting
            quality checks.
          </p>
        </header>

        <section className="experience-timeline">
          {loading ? (
            <p role="status">Loading work experience...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : experiences.length === 0 ? (
            <p>No work experience is available right now.</p>
          ) : (
            experiences.map((experience) => {
              const responsibilities = normalizeResponsibilities(
                experience.responsibilities
              );

              const technologies = Array.isArray(
                experience.technologies
              )
                ? experience.technologies
                : [];

              const isProfessional =
                experience.category === "professional";

              return (
                <article
                  className="experience-card"
                  key={experience.id}
                >
                  <div className="experience-card-top">
                    <div className="experience-company-icon">
                      <FaBriefcase />
                    </div>

                    <span className="experience-status">
                      {isProfessional
                        ? experience.status
                        : experience.status === "Completed"
                          ? "Internship Completed"
                          : experience.status || "Internship"}
                    </span>
                  </div>

                  <h2>{experience.title}</h2>

                  <h3>{experience.institution}</h3>

                  <div className="experience-meta">
                    {experience.period && (
                      <span>
                        <FaCalendarAlt />
                        {experience.period}
                      </span>
                    )}

                    {experience.location && (
                      <span>
                        <FaMapMarkerAlt />
                        {experience.location}
                      </span>
                    )}
                  </div>

                  {experience.description && (
                    <p className="experience-summary">
                      {experience.description}
                    </p>
                  )}

                  {responsibilities.length > 0 && (
                    <>
                      <div className="experience-divider" />

                      <h4>Key Responsibilities</h4>

                      <div className="experience-responsibilities">
                        {responsibilities.map((item, index) => {
                          const Icon =
                            responsibilityIcons[item.title] || FaCode;

                          return (
                            <div
                              className="experience-responsibility"
                              key={`${item.title}-${index}`}
                            >
                              <span className="responsibility-icon">
                                <Icon />
                              </span>

                              <div>
                                {item.title && <h5>{item.title}</h5>}

                                {item.description && (
                                  <p>{item.description}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {technologies.length > 0 && (
                    <>
                      <div className="experience-divider" />

                      <h4>Technologies &amp; Areas</h4>

                      <div className="experience-tags">
                        {technologies.map((technology, index) => (
                          <span key={`${technology}-${index}`}>
                            {technology}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {experience.achievement && (
                    <div className="experience-achievement">
                      <FaCheckCircle />

                      <p>
                        <strong>
                          {isProfessional
                            ? "Key Achievement"
                            : "Practical industry experience"}
                        </strong>

                        <span>{experience.achievement}</span>
                      </p>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        <section className="experience-next">
          <div className="experience-next-icon">
            <FaCode />
          </div>

          <div>
            <span className="experience-eyebrow">
              WHAT'S NEXT
            </span>

            <h2>Building on Real-World Experience</h2>

            <p>
              Continuing to strengthen my frontend development skills
              and build responsive, user-friendly web experiences.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
