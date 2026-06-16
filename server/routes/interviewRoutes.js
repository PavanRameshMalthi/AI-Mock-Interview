const express = require("express");

const {
  generateQuestions,
} = require("../controllers/interviewController");

const router = express.Router();

router.post(
  "/generate-questions",
  generateQuestions
);

module.exports = router;