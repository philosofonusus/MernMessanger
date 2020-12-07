'use strict'
const { verifyToken } = require("../../auth/auth.verifyToken")
const { getUser, updateUser, getConversations, getFriendsList } = require("../../controllers/user.controller")

module.exports = socket => {

   socket.on('getUserFromToken', async ({ token, select, now }, done) => {
      try {
         let { _id } = await verifyToken(token)
         let { error, data, message } = await getUser(_id, select)
         if (error) return done({ error, message })

         // updating status
         await updateUser(_id, { isActive: true, updatedAt: now })

         return done({ error, user: data })
      }
      catch (e) { done({ error: true, message: e.message }) }
   })
   socket.on('getUser', async ({ token, userId, select }, done) => {
      try {
         await verifyToken(token)
         let { error, data, message } = await getUser(userId, select)
         if (error) return done({ error, message })
         return done({ error, user: data })
      }
      catch (e) { done({ error: true, message: e.message }) }
   })
   socket.on('getConversations', async (token, done) => {
      try {
         let { _id } = await verifyToken(token)
         let { error, data, message } = await getConversations(_id)
         if (error) return done({ error, message })
         return done({ error, conversations: data })
      }
      catch (e) { done({ error: true, message: e.message }) }
   })
   socket.on('getFriendsList', async (token, done) => {
      try {
         let { _id } = await verifyToken(token)
         let { error, data, message } = await getFriendsList(_id)
         if (error) return done({ error, message })

         data.forEach(frnd => {
            socket.to(frnd._id).emit('activeFriend', { frndId: _id })
            socket.join(frnd._id)
         })

         return done({ error, friends: data })
      }
      catch (e) { done({ error: true, message: e.message }) }
   })

}