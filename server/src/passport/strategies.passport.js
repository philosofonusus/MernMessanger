
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy
const { loginUser, onGoogleSignin } = require("../controllers/auth.controller")
const { google } = require("./configs.passport")

exports.local = new LocalStrategy(loginUser)
exports.google = new GoogleStrategy(google, onGoogleSignin)