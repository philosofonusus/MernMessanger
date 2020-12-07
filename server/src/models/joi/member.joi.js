'use strict';
const Joi = require("@hapi/joi")
const ObjectId = new RegExp("^[0-9a-fA-F]{24}$");

const GroupMember = Joi.object({
   userId: Joi.string().pattern(ObjectId).required(),
   roles: Joi.array().required(),
   lastSeen: Joi.string().pattern(ObjectId),
   joinedAt: Joi.date().default(Date.now).required(),
   addedBy: Joi.string().pattern(ObjectId).required()
});

module.exports = GroupMember