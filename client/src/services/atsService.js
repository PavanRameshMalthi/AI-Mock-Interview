const scoreResumeText = (resumeText, role = "") => {
  const text = resumeText.toLowerCase();
  const roleTokens = role
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 2);
  const matched = roleTokens.filter((token) => text.includes(token));
  const lengthScore = Math.min(Math.round(resumeText.length / 80), 35);
  const roleScore = roleTokens.length
    ? Math.round((matched.length / roleTokens.length) * 35)
    : 20;
  const structureScore = ["experience", "education", "skills", "project"]
    .filter((token) => text.includes(token)).length * 7;

  return Math.min(lengthScore + roleScore + structureScore, 100);
};

export default {
  scoreResumeText,
};
