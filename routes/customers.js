const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customers");

router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.send(customers);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.get("/:id", async (req, res) => {
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
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });

  try {
    await customer.save();
    res.send(customer);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("customer with given id was not found");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) return res.status(404).send("Genre not found");

  res.send(customer);
});

module.exports = router;
