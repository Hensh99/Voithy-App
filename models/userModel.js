const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your E-mail"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please Enter a valid E-mail"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please Enter your confirmed password"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
