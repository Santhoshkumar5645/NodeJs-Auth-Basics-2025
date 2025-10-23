const mongoose = require("mongoose");

const connectToDB =  async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected successfully!");
  } catch (error) {
    console.log("MongoDB connectinon failed!", error);
    process.exit(1);
  }
};

module.exports = connectToDB;
