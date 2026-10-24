
import React, { useEffect, useRef, useState } from "react";

import { supabase } from "../../supabaseClient";
import {
  FiSearch,
  FiBell,
  FiExternalLink,
  FiMenu,
  FiX,
  FiMail,
  FiSidebar,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/admin": "Overview",
  "/admin/hero": "Hero Section",
  "/admin/profile": "Profile & About",
  "/admin/projects": "Projects Management",
  "/admin/skills": "Skills Management",
  "/admin/experience": "Experience",
  "/admin/education": "Education & Certifications",
  "/admin/messages": "Messages",
  "/admin/settings": "Settings",
};



const searchablePages = [
  { title: "Overview", path: "/admin", keywords: "home dashboard stats" },
  { title: "Hero Section", path: "/admin/hero", keywords: "banner introduction" },
  { title: "Profile & About", path: "/admin/profile", keywords: "about bio personal" },
  { title: "Projects Management", path: "/admin/projects", keywords: "portfolio work" },
  { title: "Skills Management", path: "/admin/skills", keywords: "technology expertise" },
  { title: "Experience", path: "/admin/experience", keywords: "jobs career work history" },
  { title: "Education & Certifications", path: "/admin/education", keywords: "degree courses certificates" },
  { title: "Messages", path: "/admin/messages", keywords: "contact email visitors" },
  { title: "Settings", path: "/admin/settings", keywords: "preferences configuration" },
];

function AdminHeader({
  sidebarCollapsed,
  onToggleSidebar,
  onToggleMobileSidebar,
}) {
  const location = useLocation();
  const [showPortfolioLink, setShowPortfolioLink] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");


  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [recordResults, setRecordResults] = useState({
    projects: [],
    messages: [],
  });
  const [recordSearchLoading, setRecordSearchLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const filteredPages = searchablePages.filter((page) => {
    const searchableText = `${page.title} ${page.keywords}`.toLowerCase();
    return searchableText.includes(searchQuery.trim().toLowerCase());
  });

  useEffect(() => {
    let active = true;
    const query = searchQuery.trim();

    if (!query) {
      setRecordResults({ projects: [], messages: [] });
      setRecordSearchLoading(false);
      return;
    }

    const searchRecords = async () => {
      setRecordSearchLoading(true);

      try {
        const [projects, descriptions, categories, names, emails, messages] =
          await Promise.all([
            supabase.from("projects").select("id, title, category")
              .ilike("title", `%${query}%`).limit(5),
            supabase.from("projects").select("id, title, category")
              .ilike("description", `%${query}%`).limit(5),
            supabase.from("projects").select("id, title, category")
              .ilike("category", `%${query}%`).limit(5),
            supabase.from("messages").select("id, name, email, message")
              .ilike("name", `%${query}%`).limit(5),
            supabase.from("messages").select("id, name, email, message")
              .ilike("email", `%${query}%`).limit(5),
            supabase.from("messages").select("id, name, email, message")
              .ilike("message", `%${query}%`).limit(5),
          ]);

        if (!active) return;

        const projectResults = [
          ...(projects.data || []),
          ...(descriptions.data || []),
          ...(categories.data || []),
        ];

        const messageResults = [
          ...(names.data || []),
          ...(emails.data || []),
          ...(messages.data || []),
        ];

        setRecordResults({
          projects: [...new Map(projectResults.map(item => [item.id, item])).values()].slice(0, 5),
          messages: [...new Map(messageResults.map(item => [item.id, item])).values()].slice(0, 5),
        });
      } catch (error) {
        console.error("Global search failed:", error);
      } finally {
        if (active) setRecordSearchLoading(false);
      }
    };

    searchRecords();

    return () => {
      active = false;
    };
  }, [searchQuery]);

  useEffect(() => {
    let active = true;

    const loadPortfolioPreference = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("show_portfolio_link")
        .eq("id", 1)
        .single();

      if (!error && active && data) {
        setShowPortfolioLink(data.show_portfolio_link);
      } else if (error) {
        console.error("Portfolio preference load failed:", error);
      }
    };

    loadPortfolioPreference();

    return () => {
      active = false;
    };
  }, []);

  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    setNotificationsError("");

    const { data, error } = await supabase
      .from("messages")
      .select("id, name, email, message, created_at, is_read")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Notifications load failed:", error);
      setNotificationsError("Notifications load nahi ho sakin.");
    } else {
      setNotifications(data || []);
    }

    setNotificationsLoading(false);
  };

  const unreadNotifications = notifications.filter(
    (item) => !item.is_read
  ).length;

  const handleNotificationClick = () => {
    const willOpen = !notificationsOpen;
    setNotificationsOpen(willOpen);

    if (willOpen) {
      fetchNotifications();
    }
  };
  const pageTitle = pageTitles[location.pathname] || "Admin Console";

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          type="button"
          className="admin-sidebar-toggle desktop-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FiSidebar size={19} />
        </button>

        <button
          type="button"
          className="admin-sidebar-toggle mobile-sidebar-toggle"
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation menu"
          title="Open navigation menu"
        >
          <FiMenu size={21} />
        </button>

        <div className="admin-header-heading">
          <div className="admin-breadcrumb">
            Admin <span>/</span> Console
          </div>
          <h1>{pageTitle}</h1>
        </div>
      </div>

      <div className="admin-header-actions">
        <button
          type="button"
          className="admin-header-icon mobile-search-toggle"
          aria-label={mobileSearchOpen ? "Close search" : "Open search"}
          aria-expanded={mobileSearchOpen}
          onClick={() => setMobileSearchOpen((prev) => !prev)}
        >
          {mobileSearchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
        </button>

        <div
          className={`admin-search-wrapper ${mobileSearchOpen ? "mobile-search-open" : ""
            }`}
          ref={searchRef}
        >
          <label className="admin-search">
            <FiSearch size={17} />

            <input
              type="search"
              placeholder="Search dashboard..."
              aria-label="Search dashboard"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setSearchOpen(false);
                }

                if (event.key === "Enter" && filteredPages.length > 0) {
                  window.location.href = filteredPages[0].path;
                }
              }}
            />

            {searchQuery ? (
              <button
                type="button"
                className="admin-search-clear"
                aria-label="Clear search"
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(true);
                }}
              >
                <FiX size={15} />
              </button>
            ) : (
              <span className="admin-search-shortcut">/</span>
            )}
          </label>

          {searchOpen && searchQuery.trim() && (
            <div className="admin-search-results">
              {filteredPages.length > 0 ? (
                <>
                  <p className="admin-search-results-label">
                    Dashboard pages
                  </p>
                  {recordSearchLoading && (
                    <p className="admin-search-no-results">Searching records...</p>
                  )}

                  {recordResults.projects.length > 0 && (
                    <>
                      <p className="admin-search-results-label">Projects</p>
                      {recordResults.projects.map(project => (
                        <a
                          key={project.id}
                          href="/admin/projects"
                          className="admin-search-result"
                          onClick={() => setSearchOpen(false)}
                        >
                          <FiSearch size={15} />
                          <span>{project.title}</span>
                          <FiExternalLink size={13} />
                        </a>
                      ))}
                    </>
                  )}

                  {recordResults.messages.length > 0 && (
                    <>
                      <p className="admin-search-results-label">Messages</p>
                      {recordResults.messages.map(message => (
                        <a
                          key={message.id}
                          href="/admin/messages"
                          className="admin-search-result"
                          onClick={() => setSearchOpen(false)}
                        >
                          <FiMail size={15} />
                          <span>{message.name || message.email || "Contact message"}</span>
                          <FiExternalLink size={13} />
                        </a>
                      ))}
                    </>
                  )}

                  {filteredPages.map((page) => (
                    <a
                      key={page.path}
                      href={page.path}
                      className="admin-search-result"
                      onClick={() => setSearchOpen(false)}
                    >
                      <FiSearch size={15} />
                      <span>{page.title}</span>
                      <FiExternalLink size={13} />
                    </a>
                  ))}
                </>
              ) : (
                <p className="admin-search-no-results">
                  No matching pages found.
                </p>
              )}
            </div>
          )}
        </div>


        {showPortfolioLink && (
          <a
            className="admin-header-live"
            href="/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open public portfolio"
            title="View public portfolio"
          >
            <FiExternalLink size={17} />
          </a>
        )}

        <div className="admin-notification-wrapper">
          <button
            className="admin-header-icon"
            type="button"
            aria-label="Notifications"
            title="Notifications"
            aria-expanded={notificationsOpen}
            onClick={handleNotificationClick}
          >
            <FiBell size={18} />

            {unreadNotifications > 0 && (
              <span className="admin-notification-count">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="admin-notification-popup">
              <div className="admin-notification-popup-header">
                <div>
                  <h3>Notifications</h3>
                  <p>Recent contact messages</p>
                </div>

                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  aria-label="Close notifications"
                >
                  <FiX size={17} />
                </button>
              </div>

              {notificationsLoading ? (
                <p className="admin-notification-status">
                  Loading notifications...
                </p>
              ) : notificationsError ? (
                <p className="admin-notification-status">
                  {notificationsError}
                </p>
              ) : notifications.length === 0 ? (
                <div className="admin-notification-empty">
                  <FiMail size={22} />
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="admin-notification-list">
                  {notifications.map((item) => (
                    <button
                      type="button"
                      className={`admin-notification-item ${!item.is_read ? "is-unread" : ""
                        }`}
                      key={item.id}
                      onClick={() => {
                        setNotificationsOpen(false);
                        window.location.href = "/admin/messages";
                      }}
                    >
                      <span className="admin-notification-icon">
                        <FiMail size={16} />
                      </span>

                      <span className="admin-notification-content">
                        <strong>{item.name || "New visitor"}</strong>
                        <span>{item.message || "New contact message"}</span>
                        <small>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : "Date unavailable"}
                        </small>
                      </span>

                      {!item.is_read && (
                        <span className="admin-notification-dot" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <a
                className="admin-notification-footer"
                href="/admin/messages"
              >
                View all messages
              </a>
            </div>
          )}
        </div>

        <div className="admin-header-avatar" title="Muhammad Zaman">
          MZ
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
