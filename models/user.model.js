const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  avatar: String,
  phone: String,
  status: String,
  token: String,
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
