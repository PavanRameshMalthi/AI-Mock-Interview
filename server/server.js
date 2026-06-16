require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

// ======================
// Database Connection
// ======================
connectDB();

// ======================
// Middleware
// ======================
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================
// Static Folder
// ======================
app.use(
  "/uploads",
  express.static("uploads")
);

// ======================
// API Routes
// ======================
app.use("/api/auth", authRoutes);

app.use("/api/resume", resumeRoutes);

app.use(
  "/api/interview",
  interviewRoutes
);

// ======================
// Health Check Route
// ======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "🚀 AI Mock Interview API Running Successfully",
  });
});

// ======================
// 404 Route
// ======================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});