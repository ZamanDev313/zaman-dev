
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiLogIn } from "react-icons/fi";
import { supabase } from "../../supabaseClient";
import "../../styles/Dashboard/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError("Login failed. Email aur password check karein.");
        return;
      }

      navigate("/admin", { replace: true });
    } catch {
      setError("Connection error. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };


  
  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Pehle apna Gmail address enter karein.");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        });

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage(
          "Agar is email ke liye account maujood hai, to password reset email bhej di gayi hai. Apna inbox check karein."
        );
      }
    } catch {
      setError("Reset email request nahi ho saki. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-logo">Z</div>

        <span className="admin-login-eyebrow">ZAMANDEV</span>
        <h1>Admin Login</h1>
        <p className="admin-login-description">
          Apne portfolio dashboard mein sign in karein.
        </p>

        <label htmlFor="admin-email">Email address</label>
        <div className="admin-login-input-wrap">
          <FiMail aria-hidden="true" />
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            placeholder="you@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <label htmlFor="admin-password">Password</label>
        <div className="admin-login-input-wrap">
          <FiLock aria-hidden="true" />
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

<button
  type="button"
  className="admin-forgot-password"
  onClick={handleForgotPassword}
  disabled={loading}
>
  Forgot Password?
</button>

{message && (
  <p className="admin-login-description" role="status">
    {message}
  </p>
)}

        {error && (
          <p className="admin-login-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="admin-login-submit"
          disabled={loading}
        >
          <FiLogIn />
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="admin-login-footer">
          Secure access to your portfolio dashboard
        </p>
      </form>
    </main>
  );
}

export default AdminLogin;
