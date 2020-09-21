const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { User, validate } = require("../models/users");

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

  let user = new User(_.pick(request.body, ["name", "email", "password"])); // here _.pick() will give an object with name, email, and password in it

  await user.save();

  //   response.send(user);
  // response.send({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email
  // });
  response.send(_.pick(request.body, ["_id", "name", "email"]));
});

module.exports = router;
