import historyService from "./historyService";

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

export default {
  getDashboardSummary,
};
