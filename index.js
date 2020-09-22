const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi); // here "joi-objectid" package returns a function and if we call that function with "Joi" class as an input then it'll return a function that can be assigned in Joi object as a method

const app = express();

// logging related codes import. needs to be import first before other custom module in order to logg errors if any error occours during loading of the below modules
require("./startup/logging")();

// routes
require("./startup/routes")(app); // ./startup/routes module returns us a function and we need to pass a reference of our express app in it to use that app internally on this module

// db connection
require("./startup/db")();

// project / app configuration
require("./startup/config")();

// throw new Error("Errrrrrrrooooooooorrrrrrr"); // simulates an unhandled exception

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("Listening on port 5000");
});
