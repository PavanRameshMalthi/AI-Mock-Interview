const extractResumeText =
  require("../utils/resumeParser");

const uploadResume = async (
  req,
  res
) => {
  try {
    const resumeText =
      await extractResumeText(
        req.file.path
      );

    res.status(200).json({
      success: true,
      resumeText,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
};