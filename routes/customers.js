const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customers");

router.use(express.json());

router.get("/", async (req, res) => {
  // #swagger.tags = ['Customers']

  try {
    const customers = await Customer.find();
    res.send(customers);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.get("/:id", async (req, res) => {
  // #swagger.tags = ['Customers']

  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).send("customer with given id was not found");

    res.send(customer);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.post("/", async (req, res) => {
  // #swagger.tags = ['Customers']

  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  try {
    await customer.save();
    res.send(customer);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.put("/:id", async (req, res) => {
  // #swagger.tags = ['Customers']

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      points: req.body.points,
      phone: req.body.phone,
      birth_date: req.body.birth_date,
    },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("customer with given id was not found");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  // #swagger.tags = ['Customers']

  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) return res.status(404).send("Genre not found");

  res.send(customer);
});

module.exports = router;
