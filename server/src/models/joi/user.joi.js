'use strict';
const Joi = require("@hapi/joi")

const User = Joi.object({
   name: Joi.string().min(3).max(16).required(),
   email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
   password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
   repeatPassword: Joi.ref('password')
}).with('password', 'repeatPassword')

module.exports = User