const { clampScore, normalizeText, tokenize, unique } = require("./textAnalysis");

const LOW_QUALITY_PATTERNS = [
  /\b(as an ai|lorem ipsum|i don't know|idk|no idea|asdf|qwerty)\b/i,
  /(.)\1{7,}/,
];

const QUESTION_BANK = {
  frontend: {
    expectedAnswer:
      "A strong answer should explain UI architecture, React or JavaScript fundamentals, accessibility, state management, responsive design, testing, and performance tradeoffs with examples.",
    keywords: ["react", "javascript", "accessibility", "state", "component", "performance", "testing", "responsive"],
    category: "Frontend",
  },
  backend: {
    expectedAnswer:
      "A strong answer should explain APIs, data models, authentication, validation, database design, error handling, security, scalability, and testing with implementation tradeoffs.",
    keywords: ["api", "database", "authentication", "validation", "security", "scalability", "testing", "error"],
    category: "Backend",
  },
  data: {
    expectedAnswer:
      "A strong answer should cover data cleaning, SQL or Python analysis, metrics, model or dashboard choices, validation, and business impact.",
    keywords: ["python", "sql", "metrics", "analysis", "model", "dashboard", "validation", "statistics"],
    category: "Data",
  },
  default: {
    expectedAnswer:
      "A strong answer should directly address the question, use relevant technical vocabulary, explain tradeoffs, and include a concrete example or result.",
    keywords: ["example", "tradeoff", "result", "implemented", "tested", "improved"],
    category: "General",
  },
};

const inferRoleProfile = (role = "") => {
  const normalized = normalizeText(role);
  if (normalized.includes("front")) return QUESTION_BANK.frontend;
  if (normalized.includes("back")) return QUESTION_BANK.backend;
  if (normalized.includes("data") || normalized.includes("ml")) return QUESTION_BANK.data;
  return QUESTION_BANK.default;
};

const inferQuestionMetadata = (questionInput, role, difficulty = "Intermediate") => {
  if (questionInput && typeof questionInput === "object") {
    return {
      question: String(questionInput.question || "").trim(),
      expectedAnswer: String(questionInput.expectedAnswer || "").trim(),
      keywords: Array.isArray(questionInput.keywords)
        ? questionInput.keywords.map((item) => String(item).toLowerCase())
        : [],
      difficulty: String(questionInput.difficulty || difficulty).trim(),
      category: String(questionInput.category || "General").trim(),
    };
  }

  const question = String(questionInput || "").trim();
  const profile = inferRoleProfile(role);
  const questionTokens = tokenize(question, 4).slice(0, 8);
  const keywords = unique([...profile.keywords, ...questionTokens]).slice(0, 10);

  return {
    question,
    expectedAnswer: profile.expectedAnswer,
    keywords,
    difficulty,
    category: profile.category,
  };
};

const getAnswerQualityFlag = (answer) => {
  const normalized = normalizeText(answer);
  const words = tokenize(answer);

  if (!normalized) return "empty";
  if (normalized.length < 8 || words.length < 2) return "empty";
  if (LOW_QUALITY_PATTERNS.some((pattern) => pattern.test(answer))) return "random";

  const uniqueWords = new Set(words);
  if (words.length >= 8 && uniqueWords.size / words.length < 0.35) return "random";
  if (normalized.length > 40 && !/[aeiou]/i.test(normalized)) return "random";

  return "valid";
};

const scoreQuestion = ({ questionInput, answer, role, difficulty }) => {
  const metadata = inferQuestionMetadata(questionInput, role, difficulty);
  const normalizedAnswer = normalizeText(answer);
  const answerTokens = new Set(tokenize(answer));
  const expectedTokens = new Set(tokenize(metadata.expectedAnswer));
  const qualityFlag = getAnswerQualityFlag(answer);
  const keywords = unique(metadata.keywords.map((keyword) => normalizeText(keyword)));
  const matchedKeywords = keywords.filter((keyword) => normalizedAnswer.includes(keyword));
  const questionTokens = tokenize(metadata.question, 4);
  const overlap = [...expectedTokens].filter((token) => answerTokens.has(token)).length;
  const relevanceHits = questionTokens.filter((token) => answerTokens.has(token)).length;

  const keywordScore = keywords.length
    ? (matchedKeywords.length / keywords.length) * 100
    : 50;
  const accuracyScore = expectedTokens.size
    ? Math.min((overlap / Math.max(expectedTokens.size * 0.28, 1)) * 100, 100)
    : keywordScore;
  const completenessScore = clampScore(
    Math.min(tokenize(answer).length / 55, 1) * 70 +
      (/[.!?]/.test(String(answer)) ? 10 : 0) +
      (/\b(example|because|tradeoff|result|impact|metric|tested|built|improved)\b/i.test(String(answer)) ? 20 : 0)
  );

  let rawScore = accuracyScore * 0.7 + keywordScore * 0.2 + completenessScore * 0.1;

  if (qualityFlag === "empty") rawScore = Math.min(rawScore, 10);
  if (qualityFlag === "random") rawScore = Math.min(rawScore, 25);
  if (qualityFlag === "valid" && relevanceHits === 0 && matchedKeywords.length === 0) {
    rawScore = Math.min(rawScore, 35);
  }
  if (qualityFlag === "valid" && rawScore > 35 && rawScore < 40) {
    rawScore = 40;
  }

  const score = clampScore(rawScore);
  const missingKeywords = keywords.filter((keyword) => !matchedKeywords.includes(keyword)).slice(0, 6);

  return {
    ...metadata,
    answer: String(answer || ""),
    score,
    accuracyScore: clampScore(accuracyScore),
    keywordScore: clampScore(keywordScore),
    completenessScore,
    matchedKeywords,
    missingKeywords,
    isEmpty: qualityFlag === "empty",
    isIrrelevant: qualityFlag === "random" || (relevanceHits === 0 && matchedKeywords.length === 0),
    feedback: buildQuestionFeedback(score, matchedKeywords, missingKeywords, qualityFlag),
  };
};

const buildQuestionFeedback = (score, matchedKeywords, missingKeywords, qualityFlag) => {
  if (qualityFlag === "empty") return "No usable answer was provided, so this question receives minimal credit.";
  if (qualityFlag === "random") return "The answer appears unrelated or low quality. Restate the concept and support it with a concrete example.";
  if (score < 40) return `The answer does not address the expected concept strongly enough. Add: ${missingKeywords.join(", ") || "role-specific details"}.`;
  if (score < 70) return `Partial answer. Good signals: ${matchedKeywords.join(", ") || "some relevance"}. Add more depth around ${missingKeywords.join(", ") || "tradeoffs and examples"}.`;
  if (score < 90) return "Mostly correct. Make it stronger with sharper examples, measurable impact, and explicit tradeoffs.";
  return "Excellent answer with strong relevance, completeness, and keyword coverage.";
};

const evaluateAnswers = ({ role, questions, answers, difficulty = "Intermediate" }) => {
  const questionScores = questions.map((questionInput, index) =>
    scoreQuestion({
      questionInput,
      answer: answers[index] || "",
      role,
      difficulty,
    })
  );

  const average = (selector) =>
    questionScores.length
      ? clampScore(questionScores.reduce((sum, item) => sum + selector(item), 0) / questionScores.length)
      : 0;

  const technical = average((item) => item.accuracyScore * 0.75 + item.keywordScore * 0.25);
  const communication = average((item) => item.completenessScore);
  const problemSolving = average((item) => item.score);
  const overall = average((item) => item.score);
  const weakQuestions = questionScores.filter((item) => item.score < 70).slice(0, 2);

  return {
    technical,
    communication,
    problemSolving,
    overall,
    feedback: buildOverallFeedback(overall, weakQuestions),
    questionScores,
  };
};

const buildOverallFeedback = (overall, weakQuestions) => {
  if (overall < 25) {
    return "Most answers were empty, irrelevant, or too thin. Re-answer each question directly, define the core concept, and add one project example.";
  }
  if (overall < 40) {
    return "Several answers missed the expected concepts. Focus on role-specific terminology, explain why your approach works, and avoid generic responses.";
  }
  if (overall < 70) {
    const gaps = weakQuestions.flatMap((item) => item.missingKeywords).slice(0, 5);
    return `You have partial coverage, but need more depth. Strengthen answers with ${gaps.join(", ") || "specific keywords"}, examples, and measurable outcomes.`;
  }
  if (overall < 90) {
    return "Strong performance. To reach excellent, make each answer more structured: concept, implementation detail, tradeoff, and impact.";
  }
  return "Excellent performance. Answers were relevant, complete, and well aligned with the expected role concepts.";
};

module.exports = {
  evaluateAnswers,
  inferQuestionMetadata,
  scoreQuestion,
};
