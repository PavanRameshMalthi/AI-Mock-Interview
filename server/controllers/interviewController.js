const model = require("../utils/gemini");

const parseQuestions = (responseText) => {
  const cleaned = responseText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => (typeof item === "string" ? item : item.question))
        .filter(Boolean);
    }
  } catch {
    // Fall back to line parsing below.
  }

  return cleaned
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
    .filter(Boolean);
};

const generateQuestions = async (req, res) => {
  try {
    const role = String(req.body.role || req.body.jobRole || "").trim();
    const experience = String(req.body.experience || "Entry level").trim();
    const difficulty = String(req.body.difficulty || "Beginner").trim();
    const resumeText = String(req.body.resumeText || "").slice(0, 12000);
    const questionCount = Math.min(
      Math.max(Number(req.body.questionCount) || 5, 1),
      10
    );

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Job role is required",
      });
    }

    const prompt = `
You are an expert technical interviewer.

Create ${questionCount} concise mock interview questions for this candidate.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}
Resume context:
${resumeText || "No resume context provided"}

Return only a JSON array of strings. Include technical, behavioral, project, and resume-based questions where relevant.
`;

    const result = await model.generateContent(prompt);
    const questions = parseQuestions(result.response.text()).slice(
      0,
      questionCount
    );

    if (!questions.length) {
      return res.status(502).json({
        success: false,
        message: "AI did not return usable questions. Please try again.",
      });
    }

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to generate interview questions",
    });
  }
};

module.exports = {
  generateQuestions,
};
