'use strict'
const router = require('express').Router()

// routers
const { userRouter, usersRouter } = require("./user.router")

// User routers
router.use("/api/users", usersRouter)
router.use("/api/user", userRouter)

module.exports = router