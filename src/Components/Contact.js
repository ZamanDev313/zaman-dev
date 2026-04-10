import { useState } from "react";
import emailjs from "emailjs-com";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceID = "service_ne7pfkd";    // replace with your service ID
    const templateID = "template_p4ln2e3";      // your template ID
    const publicKey = "TawHoDav3a_s8GgFG";    // your public key

    emailjs.send(serviceID, templateID, formData, publicKey)
      .then(
        (res) => {
          console.log("SUCCESS!", res.status, res.text);
          alert("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (err) => {
          console.log("FAILED...", err);
          alert("Failed to send message. Try again.");
        }
      );
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "linear-gradient(to right, #0a0f24, #1a1f36)",
        color: "#e6eef8",
      }}
    >
      <div className="text-center mb-5">
        <h1 className="text-primary fw-bold">CONTACT ME</h1>
        <p className="text-light mx-auto" style={{ maxWidth: "700px" }}>
          Have a project or idea? Reach out via the form below.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <form
            className="p-4 rounded border border-primary hoverable"
            style={{ background: "rgba(93,99,241,0.05)" }}
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-light">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-light">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label text-light">Message</label>
              <textarea
                id="message"
                rows="4"
                className="form-control"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary hoverable w-100">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .hoverable:hover {
          transform: scale(1.03);
          background: rgba(93,99,241,0.15);
          transition: 0.3s;
        }
      `}</style>
    </div>
  );
}
