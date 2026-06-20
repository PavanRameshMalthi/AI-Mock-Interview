import { useState } from "react";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "../../components/UI/Toast";
import authService from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResetToken("");

    try {
      const response = await authService.forgotPassword({ email });
      setResetToken(response.resetToken || "");
      showSuccess("Password reset instructions are ready");
    } catch (error) {
      showError(error.response?.data?.message || "Unable to start password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Account recovery</p>
        <h1>Forgot password</h1>
        <p className="muted">Enter your account email to receive reset instructions.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              required
              type="email"
              value={email}
            />
          </label>

          <button className="btn btn-primary full-width" disabled={loading || !email.trim()}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        {resetToken ? (
          <div className="recovery-panel">
            <strong>Development reset link</strong>
            <Link to={`/reset-password?token=${encodeURIComponent(resetToken)}`}>
              Continue to reset password
            </Link>
          </div>
        ) : null}

        <p className="auth-switch">
          Remembered it? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
