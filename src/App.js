
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import Navbar from "./Components/Portfolio/Navbar";
import Home from "./pages/Portfolio/Home";
import About from "./pages/Portfolio/About";
import Skills from "./pages/Portfolio/Skills";
import  Experience from "./pages/Portfolio/Experience"
import Education from "./pages/Portfolio/Eduaction";
import Projects from "./pages/Portfolio/Projects";
import Certifications from "./pages/Portfolio/Certifications";
import Contact from "./pages/Portfolio/Contact";
import ScrollToTop from "./Components/Portfolio/ScrollToTop";
import Resume from "./pages/Portfolio/Resume";
import Footer from "./Components/Portfolio/Footer";

import { supabase } from "./supabaseClient";

import AdminLayout from "./pages/Dashboard/AdminLayout";
import AdminOverview from "./pages/Dashboard/AdminOverview";
import AdminProjects from "./pages/Dashboard/AdminProjects";
import AdminSkills from "./pages/Dashboard/AdminSkills";
import AdminHero from "./pages/Dashboard/AdminHero";
import AdminProfile from "./pages/Dashboard/AdminProfile";
import AdminExperience from "./pages/Dashboard/AdminExperience";
import AdminEducation from "./pages/Dashboard/AdminEducation";
import AdminMessages from "./pages/Dashboard/AdminMessages";
import AdminSettings from "./pages/Dashboard/AdminSettings";
import AdminLogin from "./pages/Dashboard/AdminLogin";
import ResetPassword from "./pages/Dashboard/ResetPassword";

// // Public portfolio routes
function PublicLayout() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("portfolio-theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <div className="public-portfolio" data-theme={theme}>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/education" element={<Education />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ScrollToTop />
      <Footer />
    </div>
  );
}


// Authentication guard for admin routes
function ProtectedAdmin() {
  const location = useLocation();

  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        setSession(error ? null : data.session);
      } catch (error) {
        console.error("Admin session check failed:", error);

        if (!active) return;

        setSession(null);
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return;

      setSession(newSession);
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0b0c14",
          color: "#f5f5fa",
          fontFamily: "sans-serif",
        }}
      >
        Checking login...
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}

// Application routes
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return <PublicLayout />;
  }

  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/reset-password"
        element={<ResetPassword />}
      />

      <Route path="/admin" element={<ProtectedAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="hero" element={<AdminHero />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />

          <Route
            path="*"
            element={<Navigate to="/admin" replace />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/admin" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
