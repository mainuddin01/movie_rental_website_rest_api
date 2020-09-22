const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());

  app.use("/api/genres", genres);

  app.use("/api/customers", customers);

  app.use("/api/movies", movies);

  app.use("/api/rentals", rentals);

  app.use("/api/users", users);

  app.use("/api/auth", auth);

  // error hadling middleware will be sitted at the bottom of all other middleware and will be the last process in our project to handle errors (exceptions)
  app.use(error);
};
