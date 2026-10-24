
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiFolder,
  FiCode,
  FiBriefcase,
  FiBookOpen,
  FiMail,
  FiSettings,
  FiExternalLink,
  FiLogOut,
} from "react-icons/fi";

import { supabase } from "../../supabaseClient";

const menuItems = [
  { label: "Overview", path: "/admin", icon: FiGrid, end: true },
  { label: "Hero Section", path: "/admin/hero", icon: FiUser },
  { label: "Profile & About", path: "/admin/profile", icon: FiUser },
  { label: "Projects", path: "/admin/projects", icon: FiFolder },
  { label: "Skills", path: "/admin/skills", icon: FiCode },
  { label: "Experience", path: "/admin/experience", icon: FiBriefcase },
  {
    label: "Education & Certifications",
    path: "/admin/education",
    icon: FiBookOpen,
  },
  { label: "Messages", path: "/admin/messages", icon: FiMail },
  { label: "Settings", path: "/admin/settings", icon: FiSettings },
];

function AdminSidebar({
  collapsed = false,
  mobileOpen = false,
  onNavigate = () => { },
}) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const [showPortfolioLink, setShowPortfolioLink] = useState(true);

  useEffect(() => {
    const fetchPortfolioSetting = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("show_portfolio_link")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setShowPortfolioLink(data.show_portfolio_link);
      }
    };

    fetchPortfolioSetting();
  }, []);

  const sidebarClasses = [
    "admin-sidebar",
    collapsed ? "collapsed" : "",
    mobileOpen ? "mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      window.alert("Logout nahi ho saka. Please dobara try karein.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside
      className={sidebarClasses}
      aria-label="Admin navigation"
      aria-hidden={false}
    >
      <div className="admin-brand">
        <div className="admin-brand-mark">Z</div>
        <div className="admin-brand-text">
          <h2>ZamanDev</h2>
          <span>ADMIN CONSOLE</span>
        </div>
      </div>

      <div className="admin-sidebar-label">WORKSPACE</div>

      <nav className="admin-nav">
        {menuItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            title={collapsed ? label : undefined}
            onClick={onNavigate}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? " active" : ""}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        {showPortfolioLink && (
          <a
            className="admin-nav-link"
            href="/"
            target="_blank"
            rel="noreferrer"
            title={collapsed ? "View Portfolio" : undefined}
          >
            <FiExternalLink size={18} />
            <span>View Portfolio</span>
          </a>
        )}

        <button
          type="button"
          className="admin-nav-link admin-logout"
          title={collapsed ? "Logout" : undefined}
          onClick={handleLogout}
          disabled={loggingOut}
          aria-busy={loggingOut}
        >
          <FiLogOut size={18} />
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>

        <div className="admin-sidebar-footer">
          <div className="admin-avatar">MZ</div>
          <div className="admin-sidebar-user">
            <strong>Muhammad Zaman</strong>
            <span>Portfolio Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
