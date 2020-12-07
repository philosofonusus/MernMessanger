const mongoose = require('mongoose')
// Schema
const Group = require("./schema/group.schema")
// Export
module.exports = mongoose.model('Groups', Group)