const auth = require("../middleware/auth"); //authorization
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/users");

router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).send("User with given id was not found");

    res.send(user);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken();

  try {
    await user.save();
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, email: req.body.email, password: req.body.password },
    { new: true }
  );
  if (!user) return res.status(404).send("User with given id was not found");

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return res.status(404).send("User not found");

  res.send(user);
});

module.exports = router;
