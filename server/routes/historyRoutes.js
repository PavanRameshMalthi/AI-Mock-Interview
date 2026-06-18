const express = require("express");

const {
  getHistory,
  getAnalytics,
  softDeleteInterview,
  bulkDeleteInterviews,
  restoreInterview,
} = require(
  "../controllers/historyController"
);
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { body, param } = require("express-validator");

const router = express.Router();

router.get("/", authMiddleware, getHistory);
router.get("/analytics", authMiddleware, getAnalytics);
router.patch(
  "/bulk-delete",
  authMiddleware,
  body("interviewIds").isArray({ min: 1, max: 50 }).withMessage("Select 1-50 interviews"),
  body("interviewIds.*").isMongoId().withMessage("Every interview id must be valid"),
  validate,
  bulkDeleteInterviews
);
router.delete(
  "/:interviewId",
  authMiddleware,
  param("interviewId").isMongoId().withMessage("Valid interview id is required"),
  validate,
  softDeleteInterview
);
router.patch(
  "/:interviewId/restore",
  authMiddleware,
  param("interviewId").isMongoId().withMessage("Valid interview id is required"),
  validate,
  restoreInterview
);

module.exports = router;
