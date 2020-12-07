require('dotenv').config()
const app = require("./src")
const http = require('http')

const server = http.createServer(app)

require("./src/database/connect")()
require("./src/socket/socket")(server)

const PORT = process.env.PORT || 3875
server.listen(PORT, () => {
   console.log(`\nServer started...\nhttp://localhost:${PORT}\n`)
})