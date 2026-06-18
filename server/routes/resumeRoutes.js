const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { atsScoreRules } = require("../validators/resumeValidators");

const {
  uploadResume,
  scoreResume,
} = require("../controllers/resumeController");

router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

router.post(
  "/ats-score",
  authMiddleware,
  atsScoreRules,
  validate,
  scoreResume
);

module.exports = router;
