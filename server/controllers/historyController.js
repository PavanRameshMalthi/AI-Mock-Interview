const Interview = require("../models/Interview");
const AtsReport = require("../models/AtsReport");
const { asyncHandler, AppError } = require("../middleware/errorMiddleware");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildHistoryQuery = (req) => {
  const query = { user: req.user.id };
  const status = String(req.query.status || "active");
  const search = String(req.query.search || "").trim();
  const difficulty = String(req.query.difficulty || "").trim();

  if (status === "deleted") {
    query.deletedAt = { $ne: null };
  } else {
    query.deletedAt = null;
  }

  if (search) {
    query.role = { $regex: escapeRegex(search).slice(0, 80), $options: "i" };
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  return query;
};

const getHistory = asyncHandler(async (req, res) => {
    const interviews = await Interview.find(buildHistoryQuery(req))
      .sort({ createdAt: -1 })
      .limit(50)
      .select("role difficulty score feedback atsScore createdAt deletedAt");

    res.json({
      success: true,
      interviews,
    });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const [interviews, atsReports] = await Promise.all([
    Interview.find({ user: req.user.id })
      .sort({ createdAt: 1 })
      .limit(100)
      .select("role difficulty score feedback atsScore createdAt"),
    AtsReport.find({ user: req.user.id })
      .sort({ createdAt: 1 })
      .limit(100)
      .select("role score level matchedKeywords missingKeywords createdAt"),
  ]);

  const totalInterviews = interviews.length;
  const averageScore = totalInterviews
    ? Math.round(
        interviews.reduce((sum, item) => sum + (item.score || 0), 0) /
          totalInterviews
      )
    : 0;

  const firstScore = interviews[0]?.score || 0;
  const latestScore = interviews[interviews.length - 1]?.score || 0;
  const improvementPercentage =
    firstScore > 0 ? Math.round(((latestScore - firstScore) / firstScore) * 100) : 0;

  const keywordCounts = new Map();
  interviews.forEach((item) => {
    (item.atsScore?.matchedKeywords || []).forEach((keyword) => {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
    });
  });

  const strongSkillAreas = [...keywordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  const weakSkillAreas = atsReports
    .flatMap((report) => report.missingKeywords || [])
    .reduce((map, keyword) => {
      map.set(keyword, (map.get(keyword) || 0) + 1);
      return map;
    }, new Map());

  res.json({
    success: true,
    summary: {
      totalInterviews,
      averageScore,
      latestScore,
      improvementPercentage,
      totalAtsReports: atsReports.length,
      averageAtsScore: atsReports.length
        ? Math.round(
            atsReports.reduce((sum, item) => sum + (item.score || 0), 0) /
              atsReports.length
          )
        : 0,
    },
    trends: {
      interviewScores: interviews.map((item) => ({
        date: item.createdAt,
        role: item.role,
        score: item.score || 0,
      })),
      atsScores: atsReports.map((item) => ({
        date: item.createdAt,
        role: item.role,
        score: item.score || 0,
      })),
    },
    strongSkillAreas,
    weakSkillAreas: [...weakSkillAreas.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count })),
  });
});

const softDeleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOneAndUpdate(
    { _id: req.params.interviewId, user: req.user.id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  ).select("role deletedAt");

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  res.json({ success: true, message: "Interview moved to deleted history", interview });
});

const bulkDeleteInterviews = asyncHandler(async (req, res) => {
  const ids = Array.isArray(req.body.interviewIds) ? req.body.interviewIds : [];

  if (!ids.length) {
    throw new AppError("Select at least one interview", 400);
  }

  const result = await Interview.updateMany(
    { _id: { $in: ids }, user: req.user.id, deletedAt: null },
    { deletedAt: new Date() }
  );

  res.json({
    success: true,
    message: `${result.modifiedCount || 0} interviews moved to deleted history`,
    deletedCount: result.modifiedCount || 0,
  });
});

const restoreInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOneAndUpdate(
    { _id: req.params.interviewId, user: req.user.id, deletedAt: { $ne: null } },
    { deletedAt: null },
    { new: true }
  ).select("role deletedAt");

  if (!interview) {
    throw new AppError("Deleted interview not found", 404);
  }

  res.json({ success: true, message: "Interview restored", interview });
});

module.exports = {
  getHistory,
  getAnalytics,
  softDeleteInterview,
  bulkDeleteInterviews,
  restoreInterview,
};
