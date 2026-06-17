const express = require("express");

const {
  evaluateInterview,
} = require(
  "../controllers/evaluationController"
);
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/evaluate",
  authMiddleware,
  evaluateInterview
);

module.exports = router;
