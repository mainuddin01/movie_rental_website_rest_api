const config = require("config");
require("winston-mongodb");
const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi); // here "joi-objectid" package returns a function and if we call that function with "Joi" class as an input then it'll return a function that can be assigned in Joi object as a method
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");

// added file transport to store log on file
winston.add(winston.transports.File, { filename: "logfile.log" }); // to store logs in a file
winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vidly" }); // to store logs in mongodb
// winston.add(winston.transports.MongoDB, {
//   db: "mongodb://localhost/vidly",
//   level: "error",
// });

// to handle uncaught exception (any type of unhandled exception) in our project we can do the following
process.on("uncaughtException", (error) => {
  console.log("UNHANDLED EXCEPTION FOUND");
  winston.error(error.message, error);
});

process.on("unhandledRejection", (error) => {
  console.log("UNHANDLED REJECTION FOUND");
  winston.error(error.message, error);
  process.exit(1);
});

// throw new Error("Errrrrrrrooooooooorrrrrrr"); // simulates an unhandled exception

if (!config.get("jwtPrivateKey")) {
  console.log(
    "FATAL ERROR: jwtPrivateKey not found. set this value in widows 'set jwtPrivateKey=yourSecretKey'"
  );

  process.exit(1); // here all other numbers as arguments except 0 will be treated as error
}

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

app.use("/api/auth", auth);

// error hadling middleware will be sitted at the bottom of all other middleware and will be the last process in our project to handle errors (exceptions)
app.use(error);

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("Listening on port 5000");
});
