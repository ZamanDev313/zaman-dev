
import { useState } from "react";
import emailjs from "emailjs-com";
import { supabase } from "../../supabaseClient";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import "../../styles/portfolio/Contact.css";

const SERVICE_ID = "service_znc3eu3";
const TEMPLATE_ID = "template_p4ln2e3";
const PUBLIC_KEY = "TawHoDav3a_s8GgFG";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (status.message) {
      setStatus({ type: "", message: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSending) return;

    setIsSending(true);
    setStatus({ type: "", message: "" });

    const messageData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    };

    try {
      // Send email and save the message independently.
      const results = await Promise.allSettled([
        emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          messageData,
          PUBLIC_KEY
        ),

        supabase.from("messages").insert([messageData]),
      ]);

      const emailResult = results[0];
      const databaseResult = results[1];

      const emailSuccess = emailResult.status === "fulfilled";
      const databaseSuccess =
        databaseResult.status === "fulfilled" &&
        !databaseResult.value.error;

      if (emailResult.status === "rejected") {
        console.error("EmailJS error:", emailResult.reason);
      }

      if (
        databaseResult.status === "fulfilled" &&
        databaseResult.value.error
      ) {
        console.error(
          "Supabase save error:",
          databaseResult.value.error
        );
      } else if (databaseResult.status === "rejected") {
        console.error(
          "Supabase request error:",
          databaseResult.reason
        );
      }

      if (emailSuccess && databaseSuccess) {
        setStatus({
          type: "success",
          message:
            "Message sent successfully! Thank you for reaching out.",
        });

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else if (emailSuccess && !databaseSuccess) {
        setStatus({
          type: "error",
          message:
            "Your email was sent, but the message could not be saved to the dashboard. Please contact me by email if needed.",
        });

        // Email has already been sent, so clear the form
        // to avoid accidentally resending the same email.
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else if (!emailSuccess && databaseSuccess) {
        setStatus({
          type: "error",
          message:
            "Your message was saved, but email delivery failed. Your message is available in the dashboard.",
        });

        // The message is safely stored in Supabase.
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setStatus({
          type: "error",
          message:
            "We could not send or save your message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus({
        type: "error",
        message:
          "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-container">
        <header className="contact-header">
          <span className="contact-eyebrow">LET'S CONNECT</span>
          <h1>
            Get In <span>Touch.</span>
          </h1>
          <p>
            Have a project in mind, a job opportunity, or just want to
            say hello? I'd love to hear from you.
          </p>
        </header>

        <div className="contact-layout">
          <section className="contact-info">
            <span className="contact-section-label">CONTACT DETAILS</span>
            <h2>Let's build something great together.</h2>
            <p className="contact-info-description">
              I'm open to frontend development opportunities,
              website projects, and professional collaborations.
            </p>

            <a
              className="contact-info-card"
              href="mailto:zaman.rehmani2003@gmail.com"
              onClick={(e) => {
                e.preventDefault();
                window.location.href =
                  "mailto:zaman.rehmani2003@gmail.com";
              }}
            >
              <span className="contact-icon">
                <FaEnvelope />
              </span>
              <span className="contact-info-text">
                <small>Email me</small>
                <strong>Send an email</strong>
              </span>
            </a>

            <a
              className="contact-info-card"
              href="https://github.com/ZamanDev313/ZamanDev313"
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-icon">
                <FaGithub />
              </span>
              <span className="contact-info-text">
                <small>Explore my code</small>
                <strong>GitHub Profile</strong>
              </span>
            </a>

            <a
              className="contact-info-card"
              href="https://www.linkedin.com/in/muhammadzaman-dev/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-icon">
                <FaLinkedin />
              </span>
              <span className="contact-info-text">
                <small>Connect professionally</small>
                <strong>LinkedIn Profile</strong>
              </span>
            </a>

            <div className="contact-availability">
              <span className="availability-dot" />
              Open to frontend opportunities
            </div>
          </section>

          <section className="contact-form-card">
            <div className="contact-form-heading">
              <h2>Send a Message</h2>
              <p>Fill out the form and I'll get back to you.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="contact-field">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Tell me about your project or opportunity..."
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={5000}
                  required
                />
              </div>

              {status.message && (
                <div
                  className={`contact-status ${status.type}`}
                  role="status"
                  aria-live="polite"
                >
                  {status.type === "success" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaExclamationCircle />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <button
                className="contact-submit"
                type="submit"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
                {!isSending && <FaPaperPlane />}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
