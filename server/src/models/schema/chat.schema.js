const mongoose = require('mongoose')

// Schema
const ObjectId = mongoose.SchemaTypes.ObjectId
const Message = require("./message.schema")

const Chat = new mongoose.Schema({
   users: [ObjectId, ObjectId],
   messages: {
      type: [Message],
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
})

module.exports = Chat