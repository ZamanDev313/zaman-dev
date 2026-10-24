
import React, { useEffect, useState } from "react";
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
  FaCode,
  FaLaptopCode,
  FaTools,
} from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import "../../styles/portfolio/Skills.css";

// Map Supabase icon_key values to React icons.
const skillIcons = {
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
  FaCode,
  FiCode: FaCode,
  FaLaptopCode,
  FaTools,
};

// Fallback icons for records with NULL icon_key.
const fallbackIcons = {
  html5: FaHtml5,
  html: FaHtml5,
  css3: FaCss3Alt,
  css: FaCss3Alt,
  javascript: FaJs,
  js: FaJs,
  react: FaReact,
  "react.js": FaReact,
  "react js": FaReact,
  bootstrap: FaBootstrap,
  php: FaPhp,
  mysql: FaDatabase,
  "git & github": FaGitAlt,
  wordpress: FaWordpress,
  shopify: FaShopify,
  "figma to html/css": FaFigma,
  "responsive design": FaLaptopCode,
};

// Keep the existing category layout and descriptions.
const categoryConfig = [
  {
    title: "Frontend Development",
    description: "Building responsive and interactive user interfaces.",
    icon: FaLaptopCode,
  },
  {
    title: "CMS & Web Design",
    description: "Turning design concepts into working websites.",
    icon: FaCode,
  },
  {
    title: "Backend & Tools",
    description: "Working with databases and development tools.",
    icon: FaTools,
  },
];

// Support both the new and legacy category names.
function normalizeCategory(category) {
  const value = (category || "").trim().toLowerCase();

  if (
    ["frontend", "frontend development"].includes(value)
  ) {
    return "Frontend Development";
  }

  if (
    ["cms & web design", "cms & e-commerce"].includes(value)
  ) {
    return "CMS & Web Design";
  }

  if (
    ["backend", "backend & tools", "tools"].includes(value)
  ) {
    return "Backend & Tools";
  }

  return category;
}

function getSkillIcon(skill) {
  if (skill.icon_key && skillIcons[skill.icon_key]) {
    return skillIcons[skill.icon_key];
  }

  const name = (skill.name || "").trim().toLowerCase();

  return fallbackIcons[name] || FaCode;
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [currentlyLearning, setCurrentlyLearning] = useState([]);
  const [loading, setLoading] = useState(true);
  const [learningLoading, setLearningLoading] = useState(true);
  const [error, setError] = useState("");
  const [learningError, setLearningError] = useState("");

  // Load active skills from Supabase.
  useEffect(() => {
    let isMounted = true;

    async function fetchSkills() {
      try {
        const { data, error: fetchError } = await supabase
          .from("skills")
          .select(
            "id, name, category, icon_key, color, sort_order, is_active"
          )
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          setSkills(data || []);
          setError("");
        }
      } catch (err) {
        console.error("Failed to load skills:", err);

        if (isMounted) {
          setError("Skills load nahi ho sakin. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load active learning items from Supabase.
  useEffect(() => {
    let isMounted = true;

    async function fetchLearningItems() {
      try {
        const { data, error: fetchError } = await supabase
          .from("learning_items")
          .select("id, title, sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          setCurrentlyLearning(data || []);
          setLearningError("");
        }
      } catch (err) {
        console.error("Failed to load learning items:", err);

        if (isMounted) {
          setLearningError(
            "Currently Learning items load nahi ho sake."
          );
        }
      } finally {
        if (isMounted) {
          setLearningLoading(false);
        }
      }
    }

    fetchLearningItems();

    return () => {
      isMounted = false;
    };
  }, []);

  // Group skills according to their category.
  const skillCategories = categoryConfig.map((category) => ({
    ...category,
    skills: skills
      .filter(
        (skill) =>
          normalizeCategory(skill.category) === category.title
      )
      .map((skill) => ({
        ...skill,
        icon: getSkillIcon(skill),
        color: skill.color || "#61dafb",
      })),
  }));

  return (
    <main className="skills-page">
      <section className="skills-container">
        <header className="skills-header">
          <span className="skills-eyebrow">WHAT I WORK WITH</span>

          <h1>
            My <span>Skills</span>
          </h1>

          <p>
            Technologies and tools I use to build responsive websites,
            translate designs into code, and create practical web experiences.
          </p>
        </header>

        {/* Skills section */}
        {loading && (
          <p role="status">Loading skills...</p>
        )}

        {error && (
          <p role="alert">{error}</p>
        )}

        {!loading && !error && (
          <section
            className="skills-grid"
            aria-label="Skill categories"
          >
            {skillCategories.map((category) => {
              const CategoryIcon = category.icon;

              return (
                <article
                  className="skills-card"
                  key={category.title}
                >
                  <div className="skills-card-heading">
                    <span className="skills-category-icon">
                      <CategoryIcon />
                    </span>

                    <div>
                      <h2>{category.title}</h2>
                      <p>{category.description}</p>
                    </div>
                  </div>

                  <div className="skills-tags">
                    {category.skills.map((skill) => {
                      const SkillIcon = skill.icon;

                      return (
                        <div
                          className="skill-tag"
                          key={skill.id}
                        >
                          <span
                            className="skill-tag-icon"
                            style={{ color: skill.color }}
                          >
                            <SkillIcon />
                          </span>

                          <span>{skill.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Currently Learning section */}
        <section className="learning-card">
          <div className="learning-icon">
            <FaCode />
          </div>

          <div className="learning-content">
            <span className="learning-label">
              GROWING EVERY DAY
            </span>

            <h2>Currently Learning & Improving</h2>

            <p>
              Continuously improving my development skills and exploring
              new technologies.
            </p>

            {learningLoading && (
              <p role="status">Loading learning items...</p>
            )}

            {learningError && (
              <p role="alert">{learningError}</p>
            )}

            {!learningLoading && !learningError && (
              <div className="learning-tags">
                {currentlyLearning.map((item) => (
                  <span key={item.id}>{item.title}</span>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
