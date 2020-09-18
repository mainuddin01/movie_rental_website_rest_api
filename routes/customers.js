const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const { request } = require("express");
const router = express.Router();

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
  })
);

router.get("/", async (request, response) => {
  const customers = await Customer.find().sort("name");

  response.send(customers);
});

router.post("/", async (request, response) => {
  const { error } = validateCustomer(request.body);

  if (error) return response.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: request.body.name,
    phone: request.body.phone,
    isGold: request.body.isGold,
  });

  customer = await customer.save();

  response.send(customer);
});

router.get("/:id", async (request, response) => {
  const customer = await Customer.findById(request.params.id);

  if (!customer)
    return response
      .status(404)
      .send("The customer with the given id not found");

  response.send(customer);
});

router.put("/:id", async (request, response) => {
  const { error } = validateCustomer(request.body);

  if (error) return response.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    request.params.id,
    {
      name: request.body.name,
      phone: request.body.phone,
      isGold: request.body.isGold,
    },
    { new: true }
  );

  if (!customer)
    return response
      .status(404)
      .send("The customer with the given id not found");

  response.send(customer);
});

router.delete("/:id", async (request, response) => {
  const customer = await Customer.findByIdAndRemove(request.params.id);

  if (!customer)
    return response.status(404).send("The customer with given id not found");

  response.send(customer);
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  };

  return Joi.validate(customer, schema);
}

module.exports = router;
