
import React, { useEffect, useState } from "react";

import {
  FiFolder,
  FiCode,
  FiBriefcase,
  FiMail,
  FiArrowUpRight,
  FiExternalLink,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const stats = [
  {
    label: "Projects",
    note: "Portfolio projects",
    icon: FiFolder,
    color: "purple",
    link: "/admin/projects",
    table: "projects",
  },
  {
    label: "Skills",
    note: "Technical skills",
    icon: FiCode,
    color: "blue",
    link: "/admin/skills",
    table: "skills",
  },
  {
    label: "Experience",
    note: "Career milestones",
    icon: FiBriefcase,
    color: "green",
    link: "/admin/experience",
    table: null,
  },
  {

    label: "Messages",
    note: "Contact inquiries",
    icon: FiMail,
    color: "orange",
    link: "/admin/messages",
    table: "messages",
  },
];

function AdminOverview() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCounts() {
      setLoading(true);
      setLoadError(false);

      const results = await Promise.all(
        stats
          .filter((item) => item.table)
          .map(async (item) => {
            const { count, error } = await supabase
              .from(item.table)
              .select("*", { count: "exact", head: true });

            return {
              table: item.table,
              count,
              error,
            };
          })
      );


      const { count: unreadMessages, error: unreadError } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);


      if (unreadError) {
        setUnreadCount(null);
      } else {
        setUnreadCount(unreadMessages ?? 0);
      }


      const { count: professionalCount, error: professionalError } =
        await supabase
          .from("professional_experience")
          .select("*", { count: "exact", head: true });

      if (!isMounted) return;

      if (professionalError) {
        setExperienceCount("—");
      } else {
        setExperienceCount(professionalCount ?? 0);
      }

      if (!isMounted) return;

      const nextCounts = {};
      let hasError = false;

      results.forEach(({ table, count, error }) => {
        if (error) {
          hasError = true;
          nextCounts[table] = "—";
        } else {
          nextCounts[table] = count ?? 0;
        }
      });

      setCounts(nextCounts);
      setLoadError(hasError);
      setLoading(false);
    }

    fetchCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="admin-overview">
      <section className="admin-welcome">
        <div>
          <span className="admin-eyebrow">
            PORTFOLIO CONTROL CENTER
          </span>

          <h2>Welcome back, Zaman!</h2>

          <p>
            Manage your portfolio content and keep your professional profile
            up to date.
          </p>

          <div className="admin-welcome-actions">
            <Link
              to="/admin/projects"
              className="admin-primary-button"
            >
              Manage Projects <FiArrowUpRight size={16} />
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-secondary-button"
            >
              View Portfolio <FiExternalLink size={15} />
            </a>
          </div>
        </div>

        <div
          className="admin-welcome-decoration"
          aria-hidden="true"
        >
          &lt;/&gt;
        </div>
      </section>

      <div className="admin-section-heading">
        <div>
          <h2>Portfolio Overview</h2>
          <p>Your content management shortcuts</p>
        </div>
      </div>

      <section className="admin-stats-grid">
        {stats.map(({ label, note, icon: Icon, color, link, table }) => (
          <Link
            to={link}
            className="admin-stat-card"
            key={label}
          >
            <div className={`admin-stat-icon ${color}`}>
              <Icon size={20} />
            </div>

            <div className="admin-stat-value">
              {loading
                ? "..."
                : label === "Experience"
                  ? experienceCount ?? "—"
                  : counts[table] ?? "—"}
            </div>

            <div className="admin-stat-label">{label}</div>

            <p>{note}</p>
            {label === "Messages" && !loading && (
              <p>
                {unreadCount === null
                  ? "Unread count unavailable"
                  : `${unreadCount} unread`}
              </p>
            )}

            <span className="admin-stat-arrow">
              <FiArrowUpRight size={17} />
            </span>
          </Link>
        ))}
      </section>

      <section className="admin-quick-section">
        <div className="admin-section-heading">
          <div>
            <h2>Quick Actions</h2>
            <p>Jump directly to a portfolio section</p>
          </div>
        </div>

        <div className="admin-quick-grid">
          <Link to="/admin/hero" className="admin-quick-card">
            <span>01</span>
            <strong>Update Hero Section</strong>
            <p>Edit your homepage introduction.</p>
            <FiArrowUpRight size={17} />
          </Link>

          <Link to="/admin/profile" className="admin-quick-card">
            <span>02</span>
            <strong>Profile & About</strong>
            <p>Keep your professional bio current.</p>
            <FiArrowUpRight size={17} />
          </Link>

          <Link to="/admin/education" className="admin-quick-card">
            <span>03</span>
            <strong>Education & Certifications</strong>
            <p>Manage degrees, courses and certificates.</p>
            <FiArrowUpRight size={17} />
          </Link>

          <Link to="/admin/experience" className="admin-quick-card">
            <span>04</span>
            <strong>Work Experience</strong>
            <p>Update your internships and career history.</p>
            <FiArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      {loadError ? (
        <p className="admin-data-notice" role="status">
          Some statistics could not be loaded. Please check your connection
          and database permissions.
        </p>
      ) : !loading ? (
        <p className="admin-data-notice">
          Statistics are synced with your portfolio database.
        </p>
      ) : null}
    </div>
  );
}

export default AdminOverview;
