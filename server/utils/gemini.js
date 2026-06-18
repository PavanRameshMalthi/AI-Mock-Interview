const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("./logger");

let model = null;

if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  });
} else {
  logger.warn("GEMINI_API_KEY not configured; Gemini calls will use fallbacks.");
}

module.exports = {
  generateContent: async (prompt) => {
    if (!model) {
      throw new Error("Gemini API is not configured");
    }

    return model.generateContent(prompt);
  },
};
