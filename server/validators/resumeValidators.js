const { body } = require("express-validator");

const atsScoreRules = [
  body("resumeText")
    .trim()
    .isLength({ min: 20, max: 20000 })
    .withMessage("Resume text must be between 20 and 20000 characters"),
  body("role").optional().trim().isLength({ max: 80 }).withMessage("Role is too long"),
];

module.exports = {
  atsScoreRules,
};
