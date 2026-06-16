const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Error:");
    console.error(error);
  }
};

mongoose.connection.on("error", (err) => {
  console.log("Mongo Error:", err.message);
});

mongoose.connection.on("connected", () => {
  console.log("Mongo Connected Event Fired");
});

module.exports = connectDB;