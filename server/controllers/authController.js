const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError, asyncHandler } = require("../middleware/errorMiddleware");

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  profilePicture: user.profilePicture,
  authProvider: user.authProvider,
  isEmailVerified: user.isEmailVerified,
  isPhoneVerified: user.isPhoneVerified,
  role: user.role,
});

const requireJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("Authentication is not configured", 500);
  }
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createAccessToken = (user) => {
  requireJwtSecret();

  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
};

const createRefreshToken = () => crypto.randomBytes(48).toString("hex");

const findUserByEmailWithSecrets = async (email) => {
  const query = User.findOne({ email });
  if (query && typeof query.select === "function") {
    return query.select("+password +refreshTokenHash");
  }

  return query;
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
};

const issueSession = async (user, res) => {
  const token = createAccessToken(user);
  const refreshToken = createRefreshToken();
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save?.();
  setRefreshCookie(res, refreshToken);
  return { token, user: sanitizeUser(user) };
};

const registerUser = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError("An account already exists for this email", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    authProvider: "local",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: sanitizeUser(user),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const user = await findUserByEmailWithSecrets(email);
  const isMatch = user && user.password && (await bcrypt.compare(password, user.password));

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  res.status(200).json({
    success: true,
    ...(await issueSession(user, res)),
  });
});

const refreshSession = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  const user = await User.findOne({
    refreshTokenHash: hashToken(refreshToken),
  }).select("+refreshTokenHash");

  if (!user) {
    throw new AppError("Invalid refresh token", 401);
  }

  res.json({
    success: true,
    ...(await issueSession(user, res)),
  });
});

const logout = asyncHandler(async (req, res) => {
  if (req.user?.id) {
    await User.findByIdAndUpdate(req.user.id, { $unset: { refreshTokenHash: "" } });
  }

  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out successfully" });
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user || !(await bcrypt.compare(req.body.currentPassword, user.password || ""))) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = await bcrypt.hash(req.body.password, 12);
  user.refreshTokenHash = undefined;
  await user.save();
  res.clearCookie("refreshToken");

  res.json({ success: true, message: "Password changed successfully" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const user = await User.findOne({ email });

  if (user) {
    const resetToken = createRefreshToken();
    user.passwordResetTokenHash = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    if (process.env.NODE_ENV !== "production") {
      return res.json({
        success: true,
        message: "Password reset token generated for development.",
        resetToken,
      });
    }
  }

  res.json({
    success: true,
    message: "If an account exists, password reset instructions have been sent.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const tokenHash = hashToken(String(req.body.token || ""));
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Reset token is invalid or expired", 400);
  }

  user.password = await bcrypt.hash(req.body.password, 12);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokenHash = undefined;
  await user.save();

  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Password reset successfully" });
});

const providerUnavailable = (provider) =>
  asyncHandler(async (req, res) => {
    res.status(501).json({
      success: false,
      message: `${provider} authentication requires provider credentials and callback handling to be configured.`,
    });
  });

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  googleAuth: providerUnavailable("Google"),
  linkedinAuth: providerUnavailable("LinkedIn"),
  phoneAuth: providerUnavailable("Phone OTP"),
};
