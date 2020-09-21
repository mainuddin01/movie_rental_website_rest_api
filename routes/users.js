const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/users");

router.post("/", async (request, response) => {
  const { error } = validate(request.body);
  if (error) return response.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: request.body.email });
  if (user)
    return response.status(400).send("User with this email already registered");

  user = new User({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
  });

  await user.save();

  response.send(user);
});

module.exports = router;
