const winston = require("winston");

module.exports = function (error, request, response, next) {
  // here we can log the errors in a log file also

  // winston.log("error", error.message);
  winston.error(error.message, error);

  // LOGGING LEVELS: logging level determines the emportance of the log
  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  response.status(500).send("Something failed");
};
