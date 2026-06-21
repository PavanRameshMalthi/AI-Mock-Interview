import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { showError, showSuccess } from "../../components/UI/Toast";
import PasswordField, { PasswordStrength } from "../../components/UI/PasswordField";
import { getPasswordChecks } from "../../utils/passwordUtils";
import authService from "../../services/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    token: searchParams.get("token") || "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const checks = useMemo(() => getPasswordChecks(formData.password), [formData.password]);
  const passwordReady = Object.values(checks).every(Boolean);
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!passwordReady) {
      showError("Use a stronger password");
      return;
    }

    if (!passwordsMatch) {
      showError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        token: formData.token,
        password: formData.password,
      });
      showSuccess("Password reset successfully");
      navigate("/login");
    } catch (error) {
      showError(error.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Secure reset</p>
        <h1>Reset password</h1>
        <p className="muted">Choose a new password for your account.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Reset token
            <input
              name="token"
              onChange={handleChange}
              placeholder="Paste reset token"
              required
              type="text"
              value={formData.token}
            />
          </label>

          <PasswordField
            autoComplete="new-password"
            onChange={handleChange}
            placeholder="Enter your password"
            value={formData.password}
          />

          <PasswordField
            autoComplete="new-password"
            label="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
            placeholder="Re-enter new password"
            value={formData.confirmPassword}
          />

          <PasswordStrength
            confirmPassword={formData.confirmPassword}
            password={formData.password}
          />

          <button
            className="btn btn-primary full-width"
            disabled={loading || !formData.token || !passwordReady || !passwordsMatch}
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="auth-switch">
          Back to <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default ResetPassword;
