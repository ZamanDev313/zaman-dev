import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" },
    { path: "/education", name: "Education" },
    { path: "/skills", name: "Skills" },
    { path: "/projects", name: "Projects" },
    { path: "/contact", name: "Contact" },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg modern-navbar fixed-top">
        <div className="container">

          {/* BRAND */}
          <Link className="navbar-brand brand" to="/">
            <span>Zaman</span>Rehmani
          </Link>

          {/* TOGGLER */}
          <button
            className="navbar-toggler text-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
          >
            ☰
          </button>

          {/* LINKS */}
          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">

              {navLinks.map((link, index) => (
                <li key={index} className="nav-item">
                  <Link
                    to={link.path}
                    className={`nav-link ${
                      location.pathname === link.path ? "active-link" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {/* BUTTON */}
              <button
                onClick={() => navigate("/contact")}
                className="hire-btn ms-lg-3"
              >
                Hire Me 🚀
              </button>

            </ul>
          </div>
        </div>
      </nav>

      {/* CSS */}
      <style>{`
        .modern-navbar {
          background: rgba(10, 15, 36, 0.7);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 15px 0;
          z-index: 1000;
        }

        .brand {
          font-size: 1.5rem;
          font-weight: bold;
          color: white !important;
          letter-spacing: 1px;
        }

        .brand span {
          color: #00eaff;
        }

        .nav-link {
          color: #aab4d4 !important;
          font-weight: 500;
          position: relative;
          transition: 0.3s;
        }

        /* Hover underline effect */
        .nav-link::after {
          content: "";
          position: absolute;
          width: 0%;
          height: 2px;
          bottom: -5px;
          left: 0;
          background: #00eaff;
          transition: 0.3s;
        }

        .nav-link:hover {
          color: #ffffff !important;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* Active Link */
        .active-link {
          color: #00eaff !important;
        }

        .active-link::after {
          width: 100%;
        }

        /* Hire Button */
        .hire-btn {
          border: none;
          padding: 8px 20px;
          border-radius: 50px;
          background: linear-gradient(45deg, #00eaff, #5d63f1);
          color: #111026;
          font-weight: 600;
          transition: 0.3s;
        }

        .hire-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 234, 255, 0.3);
        }

        /* Mobile */
        @media (max-width: 991px) {
          .navbar-collapse {
            background: #0a0f24;
            padding: 20px;
            border-radius: 10px;
            margin-top: 10px;
          }

          .nav-link {
            margin-bottom: 10px;
          }

          .hire-btn {
            width: 100%;
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  );
}