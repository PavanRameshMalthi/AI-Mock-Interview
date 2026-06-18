import api from "./api";

const getHistory = async (params = {}) => {
  const hasParams = Object.values(params).some((value) => value);
  const response = hasParams
    ? await api.get("/history", { params })
    : await api.get("/history");
  return response.data;
};

const deleteInterview = async (interviewId) => {
  const response = await api.delete(`/history/${interviewId}`);
  return response.data;
};

const getInterview = async (interviewId) => {
  const response = await api.get(`/history/${interviewId}`);
  return response.data;
};

const bulkDelete = async (interviewIds) => {
  const response = await api.patch("/history/bulk-delete", { interviewIds });
  return response.data;
};

const restoreInterview = async (interviewId) => {
  const response = await api.patch(`/history/${interviewId}/restore`);
  return response.data;
};

export default {
  getHistory,
  getInterview,
  deleteInterview,
  bulkDelete,
  restoreInterview,
};
