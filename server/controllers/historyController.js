const Interview = require("../models/Interview");
const AtsReport = require("../models/AtsReport");
const { asyncHandler } = require("../middleware/errorMiddleware");

const getHistory = asyncHandler(async (req, res) => {
    const interviews = await Interview.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(25)
      .select("role difficulty score feedback atsScore createdAt");

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

module.exports = {
  getHistory,
  getAnalytics,
};
