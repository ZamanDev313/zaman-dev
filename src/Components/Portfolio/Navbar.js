import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../../styles/Components/Portfolio/Navbar.css";

export default function Navbar({ theme, onToggleTheme }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const [siteName, setSiteName] = useState("ZAMAN");

  useEffect(() => {
    let active = true;

    const loadSiteName = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("site_name")
        .eq("id", 1)
        .single();

      if (!error && active && data?.site_name) {
        setSiteName(data.site_name);
        document.title = data.site_name;
      }
    };

    loadSiteName();

    return () => {
      active = false;
    };
  }, []);

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" },
    { path: "/skills", name: "Skills" },
    { path: "/experience", name: "Experience" },
    { path: "/education", name: "Education" },
    { path: "/projects", name: "Projects" },
    { path: "/certifications", name: "Certifications" },
    { path: "/contact", name: "Contact" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="floating-navbar" aria-label="Main navigation">
        <Link
          className="navbar-brand"
          to="/"
          onClick={closeMenu}
          aria-label="M-Zaman home"
        >
          <span className="brand-mark">M</span>
          <span className="brand-name">
            {siteName}
            <span className="brand-dot">.</span>
          </span>
        </Link>

        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          id="primary-navigation"
          className={`navbar-menu ${menuOpen ? "menu-open" : ""}`}
        >
          <ul className="navbar-links">
            {navLinks.map((link) => {
              const isActive =
                location.pathname.replace(/\/$/, "") ===
                link.path.replace(/\/$/, "");

              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={closeMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={`navbar-link ${isActive ? "active-link" : ""}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>



          <button
            type="button"
            className="hire-btn"
            onClick={() => {
              closeMenu();
              window.location.href = "/resume.html";
            }}
          >
            <span>Resume Here</span>

            <span className="hire-arrow" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M7 7H17V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

          </button>



          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

        </div>
      </nav>
    </header>
  );
}
