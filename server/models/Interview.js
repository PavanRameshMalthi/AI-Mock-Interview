const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    role: String,

    questions: [String],

    answers: [String],

    score: Number,

    feedback: {
      technical: Number,
      communication: Number,
      problemSolving: Number,
      overall: Number,
      feedback: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Interview",
  interviewSchema
);