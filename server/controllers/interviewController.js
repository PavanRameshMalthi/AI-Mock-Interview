const model = require("../utils/gemini");

const generateQuestions = async (
  req,
  res
) => {
  try {
    const {
      role,
      experience,
      difficulty,
      questionCount,
      resumeText,
    } = req.body;

    const prompt = `
You are an expert interviewer.

Role: ${role}

Experience: ${experience}

Difficulty: ${difficulty}

Resume:
${resumeText || "No Resume"}

Generate ${questionCount} interview questions.

Rules:
- Technical Questions
- HR Questions
- Project Questions
- Resume Based Questions

Return JSON array only.
`;

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      result.response.text();

    let questions = [];

    try {
      questions =
        JSON.parse(response);
    } catch {
      questions = response
        .split("\n")
        .filter(
          (q) => q.trim() !== ""
        );
    }

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateQuestions,
};