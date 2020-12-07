'use strict';
const app = require('express')()
const path = require("path")
const passport = require('passport')

// Importing middlewares
const cors = require('cors')
const session = require("express-session")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require("morgan")
const { handleError } = require("../helpers/error")

// Setting up passport
require("../passport/index.passport")(passport)

// Importing router
const router = require("../routes/index.routes")

// Using middlewares
app
   .use(cors())
   .use(cookieParser())
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }))
   .use(morgan('dev'))

   .use(session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false }
   }))

   .set("view engine", "pug")
   .set('views', path.join(__dirname, '../views'))

   .use(passport.initialize())
   .use(passport.session())

   .use(router)

   .use((err, _, res, __) => { handleError(err, res) })

// Exporting app 
module.exports = app