module.exports = function (error, request, response, next) {
  // here we can log the errors in a log file also
  response.status(500).send("Something failed");
};
