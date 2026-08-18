import React, { useState } from "react";
import { X } from "lucide-react";
import { styles } from "../styles.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal({ initialMode = "login", onClose }) {
  const { signup, login } = useAuth();
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [values, setValues] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    if (!values.email.trim() || !/^\S+@\S+\.\S+$/.test(values.email)) {
      return "Enter a valid email address.";
    }
    if (values.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (mode === "signup" && !values.username.trim()) {
      return "Enter a display name.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (mode === "signup") {
        await signup(values);
      } else {
        await login(values);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.formOverlay} onClick={onClose}>
      <div style={styles.formCard} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={18} color="#C9BBA0" />
        </button>

        <div style={styles.authTabs}>
          <button
            type="button"
            style={{ ...styles.authTab, ...(mode === "login" ? styles.authTabActive : {}) }}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Log in
          </button>
          <button
            type="button"
            style={{ ...styles.authTab, ...(mode === "signup" ? styles.authTabActive : {}) }}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Sign up
          </button>
        </div>

        <h2 style={styles.formTitle}>
          {mode === "login" ? "Welcome back" : "Get your ticket"}
        </h2>

        <form style={styles.formGrid} onSubmit={handleSubmit} noValidate>
          {mode === "signup" && (
            <div style={styles.formField}>
              <label style={styles.formLabel} htmlFor="username">Display name</label>
              <input id="username" style={styles.formInput} value={values.username} onChange={setField("username")} />
            </div>
          )}

          <div style={styles.formField}>
            <label style={styles.formLabel} htmlFor="email">Email</label>
            <input id="email" type="email" style={styles.formInput} value={values.email} onChange={setField("email")} />
          </div>

          <div style={styles.formField}>
            <label style={styles.formLabel} htmlFor="password">Password</label>
            <input id="password" type="password" style={styles.formInput} value={values.password} onChange={setField("password")} />
          </div>

          {error && <p style={styles.formError}>{error}</p>}

          <div style={styles.formActions}>
            <button type="button" style={styles.formCancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.formSubmitBtn} disabled={submitting}>
              {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </div>
        </form>

        <p style={styles.authDisclaimer}>
          Accounts are handled by the Node.js backend. Use a password you are comfortable using for this local project.
        </p>
      </div>
    </div>
  );
}
