const mongoose = require("mongoose");
const Jio = require("jio");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
  })
);

function validateUser(user) {
  const schema = {
    name: Jio.string().min(5).max(50).required(),
    email: Jio.string().min(5).max(255).required().email(),
    password: Jio.string().min(5).max(255).required(),
  };

  return Jio.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;
