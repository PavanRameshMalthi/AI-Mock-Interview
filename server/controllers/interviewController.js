const generateQuestions = async (req, res) => {
  try {
    const { resumeText } = req.body;

    res.status(200).json({
      success: true,
      message: "Questions generated successfully",
      resumeText,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  generateQuestions,
};