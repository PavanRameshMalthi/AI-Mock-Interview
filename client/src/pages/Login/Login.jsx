import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../components/UI/Toast";
import PasswordField from "../../components/UI/PasswordField";
import authService from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const isValid = formData.email.trim() && formData.password;

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      showSuccess("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      showError(error.response?.data?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const showProviderSetup = () => {
    showError("This sign-in provider needs production credentials first");
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
        <p className="muted">Continue your interview practice dashboard.</p>

        <form className="form-grid" onSubmit={handleLogin}>
          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={handleChange}
              placeholder="you@example.com"
              required
              type="email"
              value={formData.email}
            />
          </label>

          <PasswordField
            autoComplete="current-password"
            onChange={handleChange}
            placeholder="Enter your password"
            value={formData.password}
          />

          <button className="btn btn-primary full-width" disabled={loading || !isValid}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-providers" aria-label="Alternative sign in options">
          <button className="btn btn-secondary full-width" onClick={showProviderSetup} type="button">
            Continue with Google
          </button>
          <button className="btn btn-secondary full-width" onClick={showProviderSetup} type="button">
            Continue with LinkedIn
          </button>
          <button className="btn btn-secondary full-width" onClick={showProviderSetup} type="button">
            Continue with Phone Number
          </button>
        </div>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
