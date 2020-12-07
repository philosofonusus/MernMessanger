'use strict';
const Joi = require("@hapi/joi")
const ObjectId = new RegExp("^[0-9a-fA-F]{24}$");

const Message = Joi.object({
   type: Joi.string().required(),
   text: Joi.string(),
   src: Joi.string(),
   url: Joi.date(),
   by: Joi.string().pattern(ObjectId).required(),
   sentAt: Joi.date().required()
});

module.exports = Message