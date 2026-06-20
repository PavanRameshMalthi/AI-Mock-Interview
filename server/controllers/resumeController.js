const fs = require("fs/promises");
const mongoose = require("mongoose");
const path = require("path");
const extractResumeText = require("../utils/resumeParser");
const { scoreResumeForRole } = require("../utils/atsScorer");
const AtsReport = require("../models/AtsReport");
const { asyncHandler, AppError } = require("../middleware/errorMiddleware");
const logger = require("../utils/logger");

const assertPdfSignature = async (filePath) => {
  const handle = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(5);
    await handle.read(buffer, 0, 5, 0);
    if (buffer.toString("utf8") !== "%PDF-") {
      throw new AppError("Uploaded file is not a valid PDF", 400);
    }
  } finally {
    await handle.close();
  }
};

const assertDocxSignature = async (filePath) => {
  const handle = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(4);
    await handle.read(buffer, 0, 4, 0);
    if (buffer.toString("utf8") !== "PK\u0003\u0004") {
      throw new AppError("Uploaded file is not a valid DOCX", 400);
    }
  } finally {
    await handle.close();
  }
};

const validateResumeFile = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".pdf") {
    await assertPdfSignature(filePath);
    return;
  }

  if (extension === ".docx") {
    await assertDocxSignature(filePath);
    return;
  }

  throw new AppError("Only PDF and DOCX resumes are allowed", 400);
};

const persistAtsReport = async ({ userId, role, resumeText, atsScore }) => {
  if (!userId || !atsScore) return;
  if (!mongoose.Types.ObjectId.isValid(userId)) return;

  try {
    await AtsReport.create({
      user: userId,
      role,
      resumeTextLength: resumeText.length,
      ...atsScore,
    });
  } catch (error) {
    logger.warn({ err: error }, "ATS report persistence failed");
  }
};

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please upload a PDF or DOCX resume", 400);
  }

  try {
    await validateResumeFile(req.file.path);
    const resumeText = await extractResumeText(req.file.path);
    if (!resumeText.trim()) {
      throw new AppError(
        "Unable to extract readable resume text from this file.",
        422
      );
    }
    const atsScore = scoreResumeForRole({ resumeText });

    await persistAtsReport({
      userId: req.user.id,
      role: "",
      resumeText,
      atsScore,
    });

    await fs.unlink(req.file.path).catch(() => {});

    res.status(200).json({
      success: true,
      resumeText,
      atsScore,
    });
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Unable to read this resume. Please upload a text-based PDF or DOCX file.",
      422
    );
  }
});

module.exports = {
  uploadResume,
  scoreResume: asyncHandler(async (req, res) => {
    const resumeText = String(req.body.resumeText || "").trim();
    const role = String(req.body.role || "").trim();

    const atsScore = scoreResumeForRole({ resumeText, role });
    await persistAtsReport({
      userId: req.user.id,
      role,
      resumeText,
      atsScore,
    });

    res.json({
      success: true,
      atsScore,
    });
  }),
};
