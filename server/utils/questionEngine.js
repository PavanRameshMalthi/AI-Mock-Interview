const { normalizeText, tokenize, unique } = require("./textAnalysis");
const { inferQuestionMetadata } = require("./evaluationEngine");

const SKILL_ALIASES = {
  react: ["react", "hooks", "jsx"],
  javascript: ["javascript", "es6"],
  typescript: ["typescript"],
  node: ["node", "node.js"],
  express: ["express"],
  mongodb: ["mongodb", "mongo"],
  sql: ["sql", "postgres", "mysql"],
  python: ["python"],
  docker: ["docker"],
  aws: ["aws", "cloud"],
};

const ROLE_SKILLS = {
  frontend: ["react", "javascript", "css", "accessibility", "testing"],
  backend: ["node", "express", "mongodb", "api", "authentication"],
  fullstack: ["react", "node", "express", "mongodb", "api"],
  data: ["python", "sql", "analytics", "dashboard", "statistics"],
  devops: ["docker", "aws", "deployment", "monitoring", "ci/cd"],
};

const ROLE_CATEGORIES = [
  ["frontend", /front|react|ui|web/i],
  ["backend", /back|api|server|node/i],
  ["fullstack", /full.?stack|mern/i],
  ["data", /data|analyst|machine|ml|ai/i],
  ["devops", /devops|cloud|sre|platform/i],
];

const getRoleKey = (role) => {
  const match = ROLE_CATEGORIES.find(([, pattern]) => pattern.test(role));
  return match ? match[0] : "fullstack";
};

const extractResumeSkills = (resumeText = "") => {
  const normalized = normalizeText(resumeText);
  const aliasMatches = Object.entries(SKILL_ALIASES)
    .filter(([, aliases]) => aliases.some((alias) => normalized.includes(alias)))
    .map(([skill]) => skill);
  const explicitSkills = tokenize(resumeText, 3)
    .filter((token) => /^(react|node|express|mongodb|python|sql|docker|aws|java|css|html|redux|typescript)$/.test(token))
    .slice(0, 12);

  return unique([...aliasMatches, ...explicitSkills]);
};

const buildQuestion = ({ question, role, difficulty, category, keywords, expectedAnswer }) => ({
  question,
  expectedAnswer:
    expectedAnswer ||
    `A strong ${role} answer should explain ${keywords.slice(0, 4).join(", ")} with implementation details, tradeoffs, and a practical example.`,
  keywords: unique(keywords).slice(0, 8),
  difficulty,
  category,
});

const createFallbackQuestionObjects = ({
  role,
  experience,
  difficulty,
  questionCount,
  resumeText,
}) => {
  const roleKey = getRoleKey(role);
  const resumeSkills = extractResumeSkills(resumeText);
  const skills = unique([...resumeSkills, ...(ROLE_SKILLS[roleKey] || ROLE_SKILLS.fullstack)]);
  const pool = [
    buildQuestion({
      question: `Tell me about your background and why you are interested in this ${role} position.`,
      role,
      difficulty,
      category: "Behavioral",
      keywords: ["motivation", "experience", roleKey],
      expectedAnswer: "A strong answer connects the candidate's background, target role, motivation, and relevant experience with a concise example.",
    }),
    buildQuestion({
      question: `Which ${role} skills from your resume are strongest, and where have you applied them?`,
      role,
      difficulty,
      category: "Resume",
      keywords: skills.slice(0, 6),
    }),
    ...skills.slice(0, 6).map((skill) =>
      buildQuestion({
        question: `Explain ${skill} in the context of a ${role} project you have built.`,
        role,
        difficulty,
        category: "Technical",
        keywords: [skill, roleKey, "project", "implementation", "tradeoff"],
      })
    ),
    buildQuestion({
      question: `How would you debug a production issue in a ${role} application?`,
      role,
      difficulty,
      category: "Problem solving",
      keywords: ["debug", "logs", "reproduce", "root cause", "testing"],
    }),
    buildQuestion({
      question: `For a ${difficulty} ${role} interview, describe one technical tradeoff you expect to discuss.`,
      role,
      difficulty,
      category: "System design",
      keywords: ["tradeoff", "performance", "security", "maintainability"],
    }),
    buildQuestion({
      question: `Based on your ${experience} experience, what measurable impact are you most proud of?`,
      role,
      difficulty,
      category: "Behavioral",
      keywords: ["impact", "metric", "result", "ownership"],
    }),
  ];

  return ensureUniqueQuestions(pool, questionCount, { role, difficulty, skills });
};

const questionKey = (question) =>
  normalizeText(typeof question === "string" ? question : question.question).replace(/[^a-z0-9]/g, "");

const ensureUniqueQuestions = (questions, questionCount, context = {}) => {
  const seen = new Set();
  const uniqueQuestions = [];

  questions.forEach((item) => {
    const metadata = inferQuestionMetadata(item, context.role, context.difficulty);
    const key = questionKey(metadata);
    if (metadata.question && !seen.has(key)) {
      seen.add(key);
      uniqueQuestions.push(metadata);
    }
  });

  const fillerSkills = context.skills?.length ? context.skills : ["project", "testing", "security", "performance"];
  let index = 0;
  while (uniqueQuestions.length < questionCount) {
    const skill = fillerSkills[index % fillerSkills.length];
    const candidate = buildQuestion({
      question: `Give a specific example of using ${skill} for ${context.role || "this role"}.`,
      role: context.role || "this role",
      difficulty: context.difficulty || "Intermediate",
      category: "Resume",
      keywords: [skill, "example", "impact", "implementation"],
    });
    const key = `${questionKey(candidate)}${index}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueQuestions.push(candidate);
    }
    index += 1;
  }

  return uniqueQuestions.slice(0, questionCount);
};

module.exports = {
  createFallbackQuestionObjects,
  ensureUniqueQuestions,
  extractResumeSkills,
  getRoleKey,
};
