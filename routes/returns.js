const express = require("express");
const router = express.Router();
const Joi = require("joi");
const auth = require("../middleware/auth");
const { Rental } = require("../models/rentals");
const moment = require("moment");
const { Movie } = require("../models/movies");
const { response } = require("express");

router.post("/", auth, async (request, response) => {
  const { error } = validateReturn(request.body);

  if (error) return response.status(400).send(error.details[0].message);

  const rental = await Rental.findOne({
    "customer._id": request.body.userId,
    "movie._id": request.body.movieId,
  });

  if (!rental) return response.status(404).send("Rental not found");

  if (rental.dateReturned)
    return response.status(400).send("Return already processed");

  rental.dateReturned = new Date();
  rental.rentalFee =
    moment().diff(rental.dateOut, "days") * rental.movie.dailyRentalRate;

  await rental.save();

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  response.send(rental);
});

function validateReturn(data) {
  const schema = {
    userId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(data, schema);
}

module.exports = router;
