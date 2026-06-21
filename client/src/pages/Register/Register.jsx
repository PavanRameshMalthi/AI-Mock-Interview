import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { showError, showSuccess } from "../../components/UI/Toast";
import PasswordField, { PasswordStrength } from "../../components/UI/PasswordField";
import { getPasswordChecks } from "../../utils/passwordUtils";
import authService from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const checks = getPasswordChecks(formData.password);
  const passwordReady = Object.values(checks).every(Boolean);
  const passwordsMatch =
    formData.password && formData.password === formData.confirmPassword;
  const canSubmit =
    formData.name.trim() &&
    formData.email.trim() &&
    passwordReady &&
    passwordsMatch &&
    !loading;

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!passwordReady) {
      showError(
        "Password must include uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (!passwordsMatch) {
      showError("Passwords do not match");
      return;
    }

    if (!emailPattern.test(formData.email.trim())) {
      showError("Enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rememberMe: true,
      });
      if (response.token) {
        storeSession(response);
        showSuccess("Account created");
        navigate("/dashboard");
        return;
      }

      showSuccess("Account created. Please sign in.");
      navigate("/login");
    } catch (error) {
      showError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const storeSession = (response) => {
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };



  return (
    <main className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 text-center">
          <Link to="/" className="text-xl font-black tracking-tight text-[var(--text)]">
            AI Mock Interview
          </Link>
        </div>

        <p className="eyebrow text-[var(--primary)] font-black uppercase tracking-widest text-xs mb-2">
          Get interview ready
        </p>
        <h1 className="text-3xl font-black text-[var(--text)] mb-2">Signup</h1>
        <p className="muted text-[var(--muted)] text-sm mb-6">
          Use a work email or personal email you trust.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="text-sm font-bold text-[var(--text)]">
            Full name
            <input
              autoComplete="name"
              name="name"
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              type="text"
              value={formData.name}
              className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
            />
          </label>

          <label className="text-sm font-bold text-[var(--text)]">
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              type="email"
              value={formData.email}
              className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
            />
          </label>

          <PasswordField
            autoComplete="new-password"
            onChange={handleChange}
            placeholder="Create a password"
            value={formData.password}
          />

          <PasswordField
            autoComplete="new-password"
            label="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
          />

          <PasswordStrength
            confirmPassword={formData.confirmPassword}
            password={formData.password}
          />

          <button 
            className="btn btn-primary full-width mt-4" 
            disabled={!canSubmit}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <p className="auth-switch text-center text-sm text-[var(--muted)] mt-6">
          Already have an account? <Link to="/login" className="text-[var(--primary)] hover:underline font-bold">Login</Link>
        </p>
      </motion.div>
    </main>
  );
};

export default Register;
