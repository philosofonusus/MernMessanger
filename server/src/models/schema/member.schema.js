const mongoose = require('mongoose')
// Schema
const ObjectId = mongoose.SchemaTypes.ObjectId

const GroupMember = new mongoose.Schema({
   userId: {
      type: ObjectId,
      required: true
   },
   roles: {
      type: Array,
      default: ["MEMBER"]
   },
   lastSeen: ObjectId, // Message Id
   joinedAt: {
      type: Date,
      default: Date.now,
   },
   addedBy: {
      type: ObjectId,
      required: true
   }
})

module.exports = GroupMember