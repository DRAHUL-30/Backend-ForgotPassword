const joi = require("joi");

const schema = {
  registerSchema: joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),

  loginSchema: joi.object({
    email: joi.string().email().required(),
    password: joi.string().alphanum().max(12).required(),
  }),
};

module.exports = schema;
