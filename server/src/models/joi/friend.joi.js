'use strict';
const Joi = require("@hapi/joi")
const ObjectId = new RegExp("^[0-9a-fA-F]{24}$");

const Friend = Joi.object({
   userId: Joi.string().pattern(ObjectId).required(),
   addedAt: Joi.date().required()
});

module.exports = Friend