'use strict'
const socketio = require("socket.io")

module.exports = server => {

   const io = socketio(server)
   io.on('connection', socket => {

      console.log("Connected => ", socket.id, new Date().toLocaleTimeString())

      socket.emit('connected', {
         clientId: socket.id
      })

      socket.on('disconnect', () => {
         console.log("Disconnected => ", new Date().toLocaleTimeString())
      })

      require("./Authentication/auth.socket")(socket)
      require("./User/user.socket")(socket)
   })
}