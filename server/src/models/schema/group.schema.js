const mongoose = require('mongoose')

// Schema
const ObjectId = mongoose.SchemaTypes.ObjectId
const GroupMember = require("./member.schema")
const Message = require("./message.schema")

const Group = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   description: String,
   members: {
      type: [GroupMember],
      validate: { validator: me => me.length > 0 }
   },
   messages: {
      type: [Message],
      default: []
   },
   thumbnail: String,
   createdAt: {
      type: Date,
      default: Date.now
   },
   createdBy: {
      type: ObjectId,
      required: true
   }
})

module.exports = Group