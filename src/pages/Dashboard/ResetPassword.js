
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiSave } from "react-icons/fi";
import { supabase } from "../../supabaseClient";
import "../../styles/Dashboard/AdminLogin.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (type === "recovery" && accessToken && refreshToken) {
        const { error: sessionError } =
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

        if (!active) return;

        if (sessionError) {
          setError("Reset link invalid ya expire ho gaya hai. Naya reset email mangwayein.");
        } else {
          setReady(true);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (!active) return;

      if (data.session) {
        setReady(true);
      } else {
        setError("Valid reset session nahi mili. Password reset email dobara mangwayein.");
      }
    };

    initialize();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password kam az kam 8 characters ka hona chahiye.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Dono passwords match nahi karte.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage("Password update ho gaya. Ab login page par ja sakte hain.");
      setPassword("");
      setConfirmPassword("");

      await supabase.auth.signOut();
    } catch {
      setError("Password update nahi ho saka. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-logo">Z</div>
        <span className="admin-login-eyebrow">ACCOUNT RECOVERY</span>
        <h1>Reset Password</h1>
        <p className="admin-login-description">
          Apne admin account ke liye naya password set karein.
        </p>

        <label htmlFor="new-password">New password</label>
        <div className="admin-login-input-wrap">
          <FiLock aria-hidden="true" />
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            required
          />
        </div>

        <label htmlFor="confirm-new-password">Confirm new password</label>
        <div className="admin-login-input-wrap">
          <FiLock aria-hidden="true" />
          <input
            id="confirm-new-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Enter password again"
            required
          />
        </div>

        {error && (
          <p className="admin-login-error" role="alert">{error}</p>
        )}

        {message && (
          <p className="admin-login-description" role="status">{message}</p>
        )}

        <button
          type="submit"
          className="admin-login-submit"
          disabled={!ready || loading}
        >
          <FiSave />
          {loading ? "Updating..." : "Update Password"}
        </button>

        <button
          type="button"
          className="admin-login-submit"
          style={{ marginTop: 10, background: "#272838" }}
          onClick={() => navigate("/admin/login")}
        >
          Back to Login
        </button>
      </form>
    </main>
  );
}

export default ResetPassword;
