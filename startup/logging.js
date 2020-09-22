const winston = require("winston");
require("winston-mongodb");
require("express-async-errors"); // for handling async errors

module.exports = function () {
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
    new winston.transports.Console({ colorize: true, prettyPrint: true }), // it will log the error in console with colored version
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (error) => {
    throw error;
  });
};
