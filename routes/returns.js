const express = require("express");
const router = express.Router();
const Joi = require("joi");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Rental } = require("../models/rentals");
const { Movie } = require("../models/movies");

router.post(
  "/",
  [auth, validate(validateReturn)],
  async (request, response) => {
    const rental = await Rental.lookup(
      request.body.userId,
      request.body.movieId
    );

    if (!rental) return response.status(404).send("Rental not found");

    if (rental.dateReturned)
      return response.status(400).send("Return already processed");

    rental.return();

    await rental.save();

    await Movie.update(
      { _id: rental.movie._id },
      {
        $inc: { numberInStock: 1 },
      }
    );

    response.send(rental);
  }
);

function validateReturn(data) {
  const schema = {
    userId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(data, schema);
}

module.exports = router;
