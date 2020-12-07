'use strict';
const Joi = require("@hapi/joi")
const ObjectId = new RegExp("^[0-9a-fA-F]{24}$");

const FriendRequest = Joi.object({
   userId: Joi.string().pattern(ObjectId).required(),
   sentAt: Joi.date().required()
});

module.exports = FriendRequest