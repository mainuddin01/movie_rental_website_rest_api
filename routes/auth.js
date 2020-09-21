const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/users");

router.post("/", async (request, response) => {
  const { error } = validate(request.body);
  if (error) return response.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: request.body.email });
  if (!user) return response.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(
    request.body.password,
    user.password
  );
  if (!validPassword)
    return response.status(400).send("Invalid email or password");

  //   const token = jwt.sign({ _id: user._id }, "secretKeyForJWTDigitalSignature");
  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

  response.send(token);
});

function validate(loginData) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(loginData, schema);
}

module.exports = router;
