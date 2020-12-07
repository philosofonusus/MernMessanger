const mongoose = require('mongoose')
// Schema
const User = require("./schema/user.schema")
// Export
module.exports = mongoose.model('Users', User)