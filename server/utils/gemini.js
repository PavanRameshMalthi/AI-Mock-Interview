const model = require("../utils/gemini");

const generateQuestions = async (req, res) => {
  try {
    const { resumeText } = req.body;

    const prompt = `
    Based on this resume:

    ${resumeText}

    Generate 10 interview questions.
    Include:
    - Technical Questions
    - HR Questions
    - Project Questions

    Return only questions.
    `;

    const result = await model.generateContent(prompt);

    const response =
      result.response.text();

    res.status(200).json({
      success: true,
      questions: response,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  generateQuestions,
};