const express = require("express");

const {
  evaluateInterview,
} = require(
  "../controllers/evaluationController"
);
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { evaluationRules } = require("../validators/interviewValidators");

const router = express.Router();

router.post(
  "/evaluate",
  authMiddleware,
  evaluationRules,
  validate,
  evaluateInterview
);

module.exports = router;
