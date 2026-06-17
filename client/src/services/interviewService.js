import api from "./api";

const generateQuestions = async (
  interviewData
) => {
  const response = await api.post(
    "/interview/generate",
    interviewData
  );

  return response.data;
};

export default {
  generateQuestions,
};
