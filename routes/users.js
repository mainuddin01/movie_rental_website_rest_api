const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/users");
const auth = require("../middleware/auth");

router.get("/me", auth, async (request, response) => {
  const user = await User.findById(request.user._id).select("-password");

  response.send(user);
});

router.post("/", async (request, response) => {
  const { error } = validate(request.body);
  if (error) return response.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: request.body.email });
  if (user)
    return response.status(400).send("User with this email already registered");

  //   user = new User({
  //     name: request.body.name,
  //     email: request.body.email,
  //     password: request.body.password,
  //   });

  user = new User(_.pick(request.body, ["name", "email", "password"])); // here _.pick() will give an object with name, email, and password in it

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  //   response.send(user);
  // response.send({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email
  // });

  // const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  const token = user.generateAuthToken();

  response
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
