import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { showError, showSuccess } from "../../components/UI/Toast";
import PasswordField from "../../components/UI/PasswordField";
import authService from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "123456",
    rememberMe: true,
  });
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState("");
  const isValid = formData.email.trim() && formData.password;

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
    setLoading(true);

    try {
      const credentials = {
        email: formData.email,
        password: formData.password,
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

  const handleProviderLogin = async (provider) => {
    setProviderLoading(provider);

    try {
      let response;
      const email = formData.email.trim().toLowerCase();
      const name = email ? email.split("@")[0] : "Demo Candidate";

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
          name: "Phone Candidate",
        });
      }

      storeSession(response);
      showSuccess("Signed in successfully");
      navigate("/dashboard");
    } catch (error) {
      showError(error.response?.data?.message || "Provider sign-in failed");
    } finally {
      setProviderLoading("");
    }
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

          <div className="auth-options">
            <label className="checkbox-row">
              <input
                checked={formData.rememberMe}
                name="rememberMe"
                onChange={(event) =>
                  setFormData({ ...formData, rememberMe: event.target.checked })
                }
                type="checkbox"
              />
              Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button className="btn btn-primary full-width" disabled={loading || !isValid}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-providers" aria-label="Alternative sign in options">
          <button
            className="btn btn-secondary full-width"
            disabled={Boolean(providerLoading)}
            onClick={() => handleProviderLogin("google")}
            type="button"
          >
            <FaGoogle aria-hidden="true" /> {providerLoading === "google" ? "Connecting..." : "Continue with Google"}
          </button>
          <button
            className="btn btn-secondary full-width"
            disabled={Boolean(providerLoading)}
            onClick={() => handleProviderLogin("linkedin")}
            type="button"
          >
            <FaLinkedin aria-hidden="true" /> {providerLoading === "linkedin" ? "Connecting..." : "Continue with LinkedIn"}
          </button>
          <button
            className="btn btn-secondary full-width"
            disabled={Boolean(providerLoading) || !formData.phone.trim()}
            onClick={() => handleProviderLogin("phone")}
            type="button"
          >
            <FaPhoneAlt aria-hidden="true" /> {providerLoading === "phone" ? "Verifying..." : "Continue with Phone"}
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
