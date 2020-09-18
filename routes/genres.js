const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");

// const genreSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         minlength: 5,
//         maxlength: 50
//     }
// });

// const Genre = mongoose.model("Genre", courseSchema);

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);

router.get("/", async (request, response) => {
  const genres = await Genre.find().sort("name");

  response.send(genres);
});

router.post("/", async (request, response) => {
  const { error } = validateGenre(request.body);

  if (error) return response.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: request.body.name,
  });

  genre = await genre.save();

  response.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}
