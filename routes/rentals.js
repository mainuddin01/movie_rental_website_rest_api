const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const mongoose = require("mongoose");
const { Rental, validate } = require("../models/rentals");
const { Customer } = require("../models/customers");
const { Movie } = require("../models/movies");

Fawn.init(mongoose); // we are using fawn package for db transaction

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

  const rental = new Rental({
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

  //   rental = await rental.save();

  //   movie.numberInStock--;
  //   movie.save();

  try {
    // we need to use Fawn.Task() to perform several operation together as a transactional unit
    // fawn library performs mongodb's two phase commit to perform transactional tasks (basically it creates a separate collection and saves transactional tasks information in it as a document and deletes that document after the task completed successfully)
    Fawn.Task()
      .save("rentals", rental) // here we need to use the actual collection name in database as the first argument
      .update(
        "movies",
        { _id: movie._id },
        {
          // here we need to use the actual collection name in database as the first argument and the query object to find the collection instance
          $inc: {
            numberInStock: -1,
          },
        }
      )
      // .remove() // we can use this method to upform operations as like as save() and update()
      .run(); // finally we need to run the task

    response.send(rental);
  } catch (error) {
    response.status(500).send("Something failed...");
  }
});

module.exports = router;
