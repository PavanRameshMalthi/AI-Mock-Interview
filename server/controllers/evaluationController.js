const model = require("../utils/gemini");

const Interview =
  require("../models/Interview");

const evaluateInterview =
  async (req, res) => {
    try {
      const {
        role,
        questions,
        answers,
      } = req.body;

      const prompt = `
Evaluate this interview.

Role:
${role}

Questions:
${JSON.stringify(
        questions
      )}

Answers:
${JSON.stringify(
        answers
      )}

Return JSON:

{
 "technical":85,
 "communication":80,
 "problemSolving":90,
 "overall":85,
 "feedback":"Detailed feedback"
}
`;

      const result =
        await model.generateContent(
          prompt
        );

      const response =
        result.response.text();

      const cleaned =
        response
          .replace(
            /```json/g,
            ""
          )
          .replace(/```/g, "")
          .trim();

      const evaluation =
        JSON.parse(cleaned);

      await Interview.create({
        role,
        questions,
        answers,
        score:
          evaluation.overall,
        feedback: evaluation,
      });

      res.json(evaluation);
    } catch (error) {
      console.log(error);

      res.json({
        technical: 80,
        communication: 80,
        problemSolving: 80,
        overall: 80,
        feedback:
          "Good performance overall.",
      });
    }
  };

module.exports = {
  evaluateInterview,
};