const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const customerSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  points: { type: Number, required: true },
  phone: { type: String, required: false },
  birth_date: { type: String, required: true },
});

//class based on our schema compiled into a model
const Customer = mongoose.model("Customer", customerSchema);

function validate(customer) {
  const schema = Joi.object({
    customer_id: Joi.number().optional(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    points: Joi.number().required(),
    phone: Joi.string().optional(),
    birth_date: Joi.string().required(),
  });

  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
module.exports.validate = validate;
