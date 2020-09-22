const config = require("config");
require("winston-mongodb");
const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi); // here "joi-objectid" package returns a function and if we call that function with "Joi" class as an input then it'll return a function that can be assigned in Joi object as a method

const app = express();

// routes
require("./startup/routes")(app); // ./startup/routes module returns us a function and we need to pass a reference of our express app in it to use that app internally on this module

// added file transport to store log on file
winston.add(winston.transports.File, { filename: "logfile.log" }); // to store logs in a file
winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vidly" }); // to store logs in mongodb
// winston.add(winston.transports.MongoDB, {
//   db: "mongodb://localhost/vidly",
//   level: "error",
// });

// to handle uncaught exception (any type of unhandled exception) in our project we can do the following
// process.on("uncaughtException", (error) => {
//   console.log("UNHANDLED EXCEPTION FOUND");
//   winston.error(error.message, error);
// });

// process.on("unhandledRejection", (error) => {
//   console.log("UNHANDLED REJECTION FOUND");
//   winston.error(error.message, error);
//   process.exit(1);
// });

// another way to handle uncaughtException and unhandledRejection
winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (error) => {
  throw error;
});

// throw new Error("Errrrrrrrooooooooorrrrrrr"); // simulates an unhandled exception

if (!config.get("jwtPrivateKey")) {
  console.log(
    "FATAL ERROR: jwtPrivateKey not found. set this value in widows 'set jwtPrivateKey=yourSecretKey'"
  );

  process.exit(1); // here all other numbers as arguments except 0 will be treated as error
}

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("Connected to mongodb...");
  })
  .catch((error) => {
    console.log("Failed to connect mongodb...");
  });

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("Listening on port 5000");
});
