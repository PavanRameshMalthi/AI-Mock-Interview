import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { showError, showSuccess } from "../../components/UI/Toast";
import PasswordField from "../../components/UI/PasswordField";
import authService from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [loading, setLoading] = useState(false);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailPattern.test(formData.email.trim()) && formData.password;

  const storeSession = (response) => {
    const storage = formData.rememberMe ? localStorage : sessionStorage;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    storage.setItem("token", response.token);
    storage.setItem("user", JSON.stringify(response.user));
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!emailPattern.test(formData.email.trim())) {
      showError("Enter a valid email address");
      return;
    }

    if (!formData.password) {
      showError("Enter your password");
      return;
    }

    setLoading(true);

    try {
      const credentials = {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      };
      const response = await authService.login(credentials);
      storeSession(response);
      showSuccess("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      showError(error.response?.data?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
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
          Welcome back
        </p>
        <h1 className="text-3xl font-black text-[var(--text)] mb-2">Login</h1>
        <p className="muted text-[var(--muted)] text-sm mb-6">
          Continue your interview practice dashboard.
        </p>

        <form className="form-grid" onSubmit={handleLogin}>
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
            autoComplete="current-password"
            onChange={handleChange}
            placeholder="Enter your password"
            value={formData.password}
          />

          <div className="auth-options flex items-center justify-between mt-2 mb-4">
            <label className="checkbox-row flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
              <input
                checked={formData.rememberMe}
                name="rememberMe"
                onChange={(event) =>
                  setFormData({ ...formData, rememberMe: event.target.checked })
                }
                type="checkbox"
                className="rounded border-[var(--border)] bg-[var(--bg)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-[var(--primary)] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button 
            className="btn btn-primary full-width" 
            disabled={loading || !isValid}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch text-center text-sm text-[var(--muted)] mt-6">
          New here? <Link to="/register" className="text-[var(--primary)] hover:underline font-bold">Signup</Link>
        </p>
      </motion.div>
    </main>
  );
};

export default Login;
