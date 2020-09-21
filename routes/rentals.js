const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rentals");
const { Customer } = require("../models/customers");
const { Movie } = require("../models/movies");

router.get("/", async (request, response) => {
  const rentals = await Rental.find().sort("-dateOut");

  response.send(rentals);
});

router.post("/", async (request, response) => {
  const { error } = validate(request.body);

  if (error) return response.status(400).send(error.details[0].message);

  const customer = await Customer.findById(request.body.customerId);
  if (!customer) return response.status(400).send("Invalid customer");

  const movie = await Movie.findById(request.body.movieId);
  if (!movie) return response.status(400).send("Invalid movie");

  if (movie.numberInStock === 0)
    return response.status(400).send("Movie not in stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental = await rental.save();

  movie.numberInStock--;
  movie.save();

  response.send(rental);
});
