const mongoose = require('mongoose')

const CONNECTION = process.env.MONGO_LOCAL
const OPTIONS = { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }

module.exports = () => {
   mongoose.connect(CONNECTION, OPTIONS, err => {
      if (err) throw err
      console.log("Database connected...")
   })
}