const express = require("express");
const winston = require("winston");

const app = express();

// logging related codes import. needs to be import first before other custom module in order to logg errors if any error occours during loading of the below modules
require("./startup/logging")();

// routes
require("./startup/routes")(app); // ./startup/routes module returns us a function and we need to pass a reference of our express app in it to use that app internally on this module

// db connection
require("./startup/db")();

// project / app configuration
require("./startup/config")();

// validation related logic imports
require("./startup/validation");

// throw new Error("Errrrrrrrooooooooorrrrrrr"); // simulates an unhandled exception

const port = process.env.PORT || 5000;
app.listen(port, () => {
  // console.log(`Listening on port ${port}`);
  winston.info(`Listening on port ${port}`);
});
