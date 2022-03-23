const Joi = require('joi');

module.exports = Joi.object({
  id: Joi.number()
    .required(),
  name: Joi.string()
    .min(3)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});