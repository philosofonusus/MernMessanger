'use strict'
const Users = require("../../models/users.model")
const { loginUser, registerUser } = require("../../controllers/auth.controller")
const { verifyToken } = require("../../auth/auth.verifyToken")

module.exports = socket => {
   socket.on('login', async ({ email, password }, done) => {
      let { error, user, token, message } = await loginUser(email, password)
      if (error) return done({ error, message })
      console.log(user, token)
      done({ user, token })
   })

   socket.on('register', async (doc, done) => {
      let user = await registerUser(doc)
      console.log(user)
      done(user)
   })

   socket.on('verifyToken', async (token, done) => {
      try { await verifyToken(token); done({ error: false, message: "Token verified" }) }
      catch (error) { done({ error: true, message: error.message }) }
   })
}