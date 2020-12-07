const mongoose = require('mongoose')
// Schema
const ObjectId = mongoose.SchemaTypes.ObjectId

const Friend = new mongoose.Schema({
   userId: {
      type: ObjectId,
      required: true
   },
   addedAt: {
      type: Date,
      default: Date.now
   }
})

module.exports = Friend