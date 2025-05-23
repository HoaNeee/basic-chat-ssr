const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to mongodb success");
  } catch (error) {
    console.log("Contect to mongo db failed");
  }
};
