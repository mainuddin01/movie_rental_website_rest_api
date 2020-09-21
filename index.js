const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi); // here "joi-objectid" package returns a function and if we call that function with "Joi" class as an input then it'll return a function that can be assigned in Joi object as a method
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");

const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("Connected to mongodb...");
  })
  .catch((error) => {
    console.log("Failed to connect mongodb...");
  });

app.use(express.json());

app.use("/api/genres", genres);

app.use("/api/customers", customers);

app.use("/api/movies", movies);

app.use("/api/rentals", rentals);

app.use("/api/users", users);

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("Listening on port 5000");
});
