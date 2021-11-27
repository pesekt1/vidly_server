const auth = require("../middleware/auth"); //authorization
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/users");

router.use(express.json());

router.get("/", async (req, res) => {
  // #swagger.tags = ['Users']

  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

//we dont expose the user id - instead we use /me
router.get("/me", auth, async (req, res) => {
  // #swagger.tags = ['Users']

  try {
    //we get user id from req.user which was set by auth middleware
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).send("User with given id was not found");

    res.send(user);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

//create a user
router.post("/", async (req, res) => {
  // #swagger.tags = ['Users']
  console.log(req.body);
  const { error } = validate(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email }); //check if exists
  console.log("existing user: ", user);
  if (user) return res.status(400).send("user already registered");

  //create new user object
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10); //salt is a random string
  user.password = await bcrypt.hash(user.password, salt); //hash users password

  const token = user.generateAuthToken();

  try {
    await user.save(); // save new user in the DB
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .header("Access-Control-Allow-Origin", "*")
      .send(_.pick(user, ["_id", "name", "email"])); //send the response
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.put("/:id", async (req, res) => {
  // #swagger.tags = ['Users']

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
  // #swagger.tags = ['Users']

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return res.status(404).send("User not found");

  res.send(user);
});

module.exports = router;
