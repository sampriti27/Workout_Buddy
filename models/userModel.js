const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method (since we are using this keyword so we need to make normal function instead of arrow func)
userSchema.statics.signup = async function (email, password) {
  //validation
  if (!email || !password) {
    throw new Error("All fields must not be empty!");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Please enter valid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password not strong enough!");
  }

  //existing email check
  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

//static login method
userSchema.statics.login = async function (email, password) {
  //validation
  if (!email || !password) {
    throw new Error("All fields must not be empty!");
  }

  //existing email check
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Incorrect email!");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Incorrect Password!");
  }

  return user;
};
module.exports = mongoose.model("User", userSchema);
