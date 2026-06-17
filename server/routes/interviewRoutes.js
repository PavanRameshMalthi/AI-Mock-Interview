const express = require("express");

const {
  generateQuestions,
} = require("../controllers/interviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  generateQuestions
);

router.post(
  "/generate-questions",
  authMiddleware,
  generateQuestions
);

module.exports = router;
