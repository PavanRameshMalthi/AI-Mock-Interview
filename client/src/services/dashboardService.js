import historyService from "./historyService";
import api from "./api";

const getDashboardSummary = async () => {
  const data = await historyService.getHistory();
  const interviews = data.interviews || [];
  const completed = interviews.length;
  const averageScore = completed
    ? Math.round(
        interviews.reduce((sum, item) => sum + (item.score || 0), 0) /
          completed
      )
    : 0;

  return {
    completed,
    averageScore,
    recent: interviews.slice(0, 5),
  };
};

const getAnalytics = async () => {
  const response = await api.get("/history/analytics");
  return response.data;
};

export default {
  getDashboardSummary,
  getAnalytics,
};
