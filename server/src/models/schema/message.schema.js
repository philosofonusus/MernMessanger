const mongoose = require('mongoose')

// Schema
const ObjectId = mongoose.SchemaTypes.ObjectId

const Message = new mongoose.Schema({
   // TEXT, IMAGE, LINK, FILE
   type: {
      type: String,
      required: true,
      default: "TEXT"
   },
   text: String,  // Message text
   src: String,   // Image source
   url: String,   // file or link url
   by: {
      type: ObjectId,
      required: true
   },
   sentAt: {
      type: Date,
      default: Date.now
   }
})

module.exports = Message