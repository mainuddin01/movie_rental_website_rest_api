const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customers");

router.get("/", async (request, response) => {
  const customers = await Customer.find().sort("name");

  response.send(customers);
});

router.post("/", async (request, response) => {
  const { error } = validate(request.body);

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
  const { error } = validate(request.body);

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

module.exports = router;
