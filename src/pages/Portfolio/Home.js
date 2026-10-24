
import React, { useEffect, useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaDownload,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../../styles/portfolio/Home.css";

const defaultHomeContent = {
  eyebrow: "WELCOME TO MY PORTFOLIO",
  greeting: "Hi, I'm",
  full_name: "Muhammad Zaman",
  professional_title: "Junior Frontend Developer",
  description:
    "I build responsive, user-friendly websites by turning Figma designs into clean, functional interfaces using HTML, CSS, JavaScript, and React. I also have practical experience with WordPress, Shopify, and website QA.",
  primary_button_text: "View My Work",
  primary_button_link: "/projects",
  resume_button_text: "Download Resume",
  resume_url:
    "https://drive.google.com/uc?export=download&id=14EazgdMXhtH3hDq0fPCCZ8F4Ph41wxht",
  availability_text:
    "Open to Junior Frontend Developer opportunities",
  profile_image_url: "/myProfileImage.png",
  social_links: [
    {
      label: "GitHub",
      href: "https://github.com/ZamanDev313/ZamanDev313",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/muhammadzaman-dev/",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/zaman_rehmani_313/",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=1000852328933",
    },
  ],
  tech_badges: [
    {
      name: "React",
      image_url:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
      name: "PHP",
      image_url:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    },
  ],
  image_caption: "Building for the web",
};

const socialIcons = {
  github: <FaGithub />,
  linkedin: <FaLinkedin />,
  instagram: <FaInstagram />,
  facebook: <FaFacebook />,
};

export default function Home() {
  const [homeContent, setHomeContent] = useState(defaultHomeContent);

  useEffect(() => {
    let isMounted = true;

    async function fetchHomeContent() {
      const { data, error } = await supabase
        .from("home_content")
        .select("*")
        .eq("is_active", true)
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        console.error("Failed to load Home content:", error.message);
        return;
      }

      if (data) {
        setHomeContent({
          ...defaultHomeContent,
          ...data,
          social_links: Array.isArray(data.social_links)
            ? data.social_links
            : defaultHomeContent.social_links,
          tech_badges: Array.isArray(data.tech_badges)
            ? data.tech_badges
            : defaultHomeContent.tech_badges,
        });
      }
    }

    fetchHomeContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const titleWords = homeContent.professional_title
    .trim()
    .split(/\s+/);

  const titleFirstWord = titleWords.shift() || "";
  const titleRemaining = titleWords.join(" ");

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-container">
          <div className="home-layout">
            <div className="home-content">
              <span className="home-eyebrow">
                <span className="home-status-dot" />
                {homeContent.eyebrow}
              </span>

              <h1>
                {homeContent.greeting}
                <span className="home-name">
                  {" "}{homeContent.full_name}.
                </span>
              </h1>

              <h2 className="home-role">
                {titleFirstWord}{" "}
                <span>{titleRemaining}</span>
              </h2>

              <p className="home-description">
                {homeContent.description}
              </p>

              <div className="home-actions">
                <Link
                  to={homeContent.primary_button_link || "/projects"}
                  className="home-btn home-btn-primary"
                >
                  {homeContent.primary_button_text}
                  <FaArrowRight />
                </Link>

                <a
                  href={homeContent.resume_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-btn home-btn-secondary"
                  onClick={(event) => {
                    if (!homeContent.resume_url) {
                      event.preventDefault();
                    }
                  }}
                >
                  {homeContent.resume_button_text}
                  <FaDownload />
                </a>
              </div>

              <div className="home-availability">
                <span className="home-availability-dot" />
                <p>{homeContent.availability_text}</p>
              </div>

              <div className="home-social-area">
                <span className="home-social-label">
                  CONNECT WITH ME
                </span>

                <div className="home-social-links">
                  {homeContent.social_links.map((social) => {
                    const icon =
                      socialIcons[social.label?.toLowerCase()];

                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="home-social-link"
                        aria-label={social.label}
                        title={social.label}
                      >
                        {icon}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="home-visual">
              <div className="home-orbit home-orbit-outer" />
              <div className="home-orbit home-orbit-inner" />
              <div className="home-image-glow" />

              <div className="home-profile-frame">
                <img
                  src={homeContent.profile_image_url}
                  alt={homeContent.full_name}
                  className="home-profile-image"
                />
              </div>

              {homeContent.tech_badges.map((badge, index) => (
                <div
                  key={badge.name}
                  className={`home-tech-badge ${
                    index === 0
                      ? "home-react-badge"
                      : index === 1
                      ? "home-php-badge"
                      : ""
                  }`}
                  title={badge.name}
                >
                  <img
                    src={badge.image_url}
                    alt={badge.name}
                  />
                </div>
              ))}

              <div className="home-image-caption">
                <span className="home-caption-indicator" />
                <span>{homeContent.image_caption}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
