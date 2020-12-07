const mongoose = require('mongoose')
// Schema
const Chat = require("./schema/chat.schema")
// Export
module.exports = mongoose.model('Chats', Chat)