const model = require("../utils/gemini");
const Interview = require("../models/Interview");

const fallbackEvaluation = {
  technical: 70,
  communication: 70,
  problemSolving: 70,
  overall: 70,
  feedback:
    "The evaluation service could not produce a detailed result. Review your answers for clarity, structure, and job-specific examples.",
};

const clampScore = (value) => {
  const score = Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.min(Math.max(Math.round(score), 0), 100);
};

const parseEvaluation = (responseText) => {
  const cleaned = responseText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const parsed = JSON.parse(cleaned);

  return {
    technical: clampScore(parsed.technical),
    communication: clampScore(parsed.communication),
    problemSolving: clampScore(parsed.problemSolving),
    overall: clampScore(parsed.overall),
    feedback: String(parsed.feedback || "").trim(),
  };
};

const evaluateInterview = async (req, res) => {
  try {
    const role = String(req.body.role || "").trim();
    const questions = Array.isArray(req.body.questions)
      ? req.body.questions.map(String)
      : [];
    const answers = Array.isArray(req.body.answers)
      ? req.body.answers.map(String)
      : [];

    if (!role || !questions.length || !answers.length) {
      return res.status(400).json({
        success: false,
        message: "Role, questions, and answers are required",
      });
    }

    const prompt = `
Evaluate this mock interview objectively.

Role: ${role}
Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}

Return only JSON in this shape:
{
 "technical": 85,
 "communication": 80,
 "problemSolving": 90,
 "overall": 85,
 "feedback": "Actionable feedback in 3-5 sentences"
}
`;

    let evaluation = fallbackEvaluation;

    try {
      const result = await model.generateContent(prompt);
      evaluation = parseEvaluation(result.response.text());
    } catch {
      evaluation = fallbackEvaluation;
    }

    await Interview.create({
      user: req.user.id,
      role,
      questions,
      answers,
      score: evaluation.overall,
      feedback: evaluation,
    });

    res.json({
      success: true,
      ...evaluation,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to evaluate interview",
    });
  }
};

module.exports = {
  evaluateInterview,
};
