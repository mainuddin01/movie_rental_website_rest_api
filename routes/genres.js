const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genres");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

router.get(
  "/",
  asyncMiddleware(async (request, response, next) => {
    const genres = await Genre.find().sort("name");

    response.send(genres);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (request, response) => {
    const { error } = validate(request.body);

    if (error) return response.status(400).send(error.details[0].message);

    const genre = new Genre({
      name: request.body.name,
    });

    await genre.save();

    response.send(genre);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (request, response) => {
    const genre = await Genre.findById(request.params.id);

    if (!genre)
      return response.status(404).send("The genre with the given id not found");

    response.send(genre);
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (request, response) => {
    const { error } = validate(request.body);

    if (error) return response.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
      },
      { new: true }
    );

    if (!genre)
      return response.status(404).send("The genre with the given id not found");

    response.send(genre);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (request, response) => {
    const genre = await Genre.findByIdAndRemove(request.params.id);

    if (!genre)
      return response.status(404).send("The genre with the given id not found");

    response.send(genre);
  })
);

module.exports = router;
