const express = require("express");

const {
  generateQuestions,
} = require("../controllers/interviewController");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { generateRules } = require("../validators/interviewValidators");

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  generateRules,
  validate,
  generateQuestions
);

router.post(
  "/generate-questions",
  authMiddleware,
  generateRules,
  validate,
  generateQuestions
);

module.exports = router;
