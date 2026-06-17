import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../components/UI/Toast";
import authService from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password.length < 8) {
      showError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await authService.register(formData);
      showSuccess("Account created. Please sign in.");
      navigate("/login");
    } catch (error) {
      showError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Get interview ready</p>
        <h1>Create account</h1>
        <p className="muted">Use a work email or personal email you trust.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              autoComplete="name"
              name="name"
              onChange={handleChange}
              placeholder="Alex Morgan"
              required
              type="text"
              value={formData.name}
            />
          </label>

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

          <label>
            Password
            <input
              autoComplete="new-password"
              minLength={8}
              name="password"
              onChange={handleChange}
              placeholder="At least 8 characters"
              required
              type="password"
              value={formData.password}
            />
          </label>

          <button className="btn btn-primary full-width" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
