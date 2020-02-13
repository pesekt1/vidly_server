const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/users");

router.use(express.json());

router.post("/", async (req, res) => {
  console.log("auth post");
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("invaild email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("invaild email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string()
      .min(4)
      .required()
  });

  return schema.validate(req);
}

module.exports = router;
