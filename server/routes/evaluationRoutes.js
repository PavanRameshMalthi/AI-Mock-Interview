const express = require("express");

const {
  evaluateInterview,
} = require(
  "../controllers/evaluationController"
);

const router = express.Router();

router.post(
  "/evaluate",
  evaluateInterview
);

module.exports = router;