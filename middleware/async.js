module.exports = function (handler) {
  return async function (request, response, next) {
    try {
      await handler(request, response);
    } catch (error) {
      next(error);
    }
  };
};
