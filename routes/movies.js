const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movies");
const { Genre } = require("../models/genres");

router.get("/", async (request, response) => {
  const movies = await Movie.find().sort("title");

  response.send(movies);
});

router.post("/", async (request, response) => {
  const { error } = validate(request.body);

  if (error) return response.status(400).send(error.details[0].message);

  const genre = await Genre.findById(request.body.genreId);

  if (!genre) return response.status(404).send("Invalid genre id supplied");

  let movie = new Movie({
    title: request.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: request.body.numberInStock,
    dailyRentalRate: request.body.dailyRentalRate,
  });

  movie = await movie.save();

  response.send(movie);
});

router.get("/:id", async (request, response) => {
  const movie = await Movie.findById(request.params.id);

  if (!movie)
    return response.status(404).send("The movie with the given id not found");

  response.send(movie);
});

router.put("/:id", async (request, response) => {
  const { error } = validate(request.body);

  if (error) return response.status(400).send(error.details[0].message);

  const genre = await Genre.findById(request.body.genreId);

  if (!genre) return response.status(404).send("Invalid genre");

  const movie = await Movie.findByIdAndUpdate(
    request.params.id,
    {
      title: request.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: request.body.numberInStock,
      dailyRentalRate: request.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return response.status(404).send("The movie with the given id not found");

  response.send(movie);
});

router.delete("/:id", async (request, response) => {
  const movie = await Movie.findByIdAndRemove(request.params.id);

  if (!movie)
    return response.status(404).send("The movie with the given id not found");

  response.send(movie);
});

module.exports = router;
