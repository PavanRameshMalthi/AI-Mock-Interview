const express = require("express");

const {
  getHistory,
  getAnalytics,
} = require(
  "../controllers/historyController"
);
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getHistory);
router.get("/analytics", authMiddleware, getAnalytics);

module.exports = router;
