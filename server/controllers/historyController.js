const Interview =
  require("../models/Interview");

const getHistory = async (
  req,
  res
) => {
  try {
    const interviews =
      await Interview.find().sort({
        createdAt: -1,
      });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getHistory,
};