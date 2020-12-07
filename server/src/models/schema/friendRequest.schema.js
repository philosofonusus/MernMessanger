const mongoose = require('mongoose')
// Schema
const ObjectId = mongoose.SchemaTypes.ObjectId

const FriendRequest = new mongoose.Schema({
   userId: {
      type: ObjectId,
      required: true
   },
   sentAt: {
      type: Date,
      default: Date.now
   }
})

module.exports = FriendRequest