const Joi = require("joi");

module.exports = function () {
  Joi.objectId = require("joi-objectid")(Joi); // here "joi-objectid" package returns a function and if we call that function with "Joi" class as an input then it'll return a function that can be assigned in Joi object as a method
};
