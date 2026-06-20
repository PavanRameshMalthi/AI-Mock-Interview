import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
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
    phone: "",
    otp: "123456",
  });
  const [providerLoading, setProviderLoading] = useState("");

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

    setLoading(true);

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
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

  const handleProviderSignup = async (provider) => {
    setProviderLoading(provider);

    try {
      let response;
      const email = formData.email.trim().toLowerCase();
      const name = formData.name.trim() || (email ? email.split("@")[0] : "Demo Candidate");

      if (provider === "google") {
        response = await authService.googleLogin({
          email: email || "google.demo@example.com",
          name,
          googleId: `google:${email || "demo"}`,
        });
      }

      if (provider === "linkedin") {
        response = await authService.linkedinLogin({
          email: email || "linkedin.demo@example.com",
          name,
          linkedinId: `linkedin:${email || "demo"}`,
          headline: "Interview candidate",
        });
      }

      if (provider === "phone") {
        response = await authService.phoneLogin({
          phone: formData.phone,
          otp: formData.otp,
          name,
        });
      }

      storeSession(response);
      showSuccess("Account ready");
      navigate("/dashboard");
    } catch (error) {
      showError(error.response?.data?.message || "Provider sign-up failed");
    } finally {
      setProviderLoading("");
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

          <PasswordField
            autoComplete="new-password"
            onChange={handleChange}
            placeholder="Use a strong password"
            value={formData.password}
          />

          <PasswordField
            autoComplete="new-password"
            label="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
          />

          <PasswordStrength
            confirmPassword={formData.confirmPassword}
            password={formData.password}
          />

          <div className="form-row">
            <label>
              Phone
              <input
                autoComplete="tel"
                name="phone"
                onChange={handleChange}
                placeholder="+91 98765 43210"
                type="tel"
                value={formData.phone}
              />
            </label>
            <label>
              OTP
              <input
                inputMode="numeric"
                name="otp"
                onChange={handleChange}
                placeholder="123456"
                type="text"
                value={formData.otp}
              />
            </label>
          </div>

          <button className="btn btn-primary full-width" disabled={!canSubmit}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="auth-providers" aria-label="Alternative sign up options">
          <button
            className="btn btn-secondary full-width"
            disabled={Boolean(providerLoading)}
            onClick={() => handleProviderSignup("google")}
            type="button"
          >
            <FaGoogle aria-hidden="true" /> {providerLoading === "google" ? "Connecting..." : "Sign up with Google"}
          </button>
          <button
            className="btn btn-secondary full-width"
            disabled={Boolean(providerLoading)}
            onClick={() => handleProviderSignup("linkedin")}
            type="button"
          >
            <FaLinkedin aria-hidden="true" /> {providerLoading === "linkedin" ? "Connecting..." : "Sign up with LinkedIn"}
          </button>
          <button
            className="btn btn-secondary full-width"
            disabled={Boolean(providerLoading) || !formData.phone.trim()}
            onClick={() => handleProviderSignup("phone")}
            type="button"
          >
            <FaPhoneAlt aria-hidden="true" /> {providerLoading === "phone" ? "Verifying..." : "Sign up with Phone"}
          </button>
        </div>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
