// Strategy
const strategies = require("./strategies.passport")
const Users = require("../models/users.model")
const jwt = require("jsonwebtoken")

module.exports = passport => {

   passport.use(strategies.local)
   passport.use(strategies.google)

   passport.serializeUser((user, done) => done(null, user._id))

   passport.deserializeUser(async (_id, done) => {
      try {
         let user = await Users.findById(_id).select("-__v -createdAt -updatedAt")
         let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
         return user ? done(null, { ...user._doc, token }) : done({ code: 404, message: "User not found" }, null)
      } catch (error) { done(error, null) }
   });

}