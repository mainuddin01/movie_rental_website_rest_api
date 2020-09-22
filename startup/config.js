const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    // console.log("FATAL ERROR: jwtPrivateKey not found. set this value in widows 'set jwtPrivateKey=yourSecretKey'");
    // process.exit(1); // here all other numbers as arguments except 0 will be treated as error
    throw new Error(
      "FATAL ERROR: jwtPrivateKey not found. set this value in widows 'set jwtPrivateKey=yourSecretKey'"
    );
  }
};
