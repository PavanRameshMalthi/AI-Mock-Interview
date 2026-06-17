import api from "./api";

const getHistory = async () => {
  const response = await api.get("/history");
  return response.data;
};

export default {
  getHistory,
};
