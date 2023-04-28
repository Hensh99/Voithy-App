const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: `Passwords are not the same! `,
    },
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if pass was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
