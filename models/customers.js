const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isGold: Boolean,
  phone: String
});

//class based on our schema compiled into a model
const Customer = mongoose.model("Customer", customerSchema);

function validate(customer) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required(),
    phone: Joi.string(),
    isGold: Joi.boolean()
  });

  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
module.exports.validate = validate;
