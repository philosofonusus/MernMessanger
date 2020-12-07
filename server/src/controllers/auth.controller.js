const Users = require("../models/users.model")
const jwt = require("jsonwebtoken")
const bCript = require('bcryptjs')

const { CError, ErrorHandler } = require("../helpers/error")
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../helpers/http.status")

const registerUser = async doc => {
   try {

      await Users.init()
      let user = new Users({ ...doc, email: doc.email.toLowerCase() })

      let existedUser = await Users.findOne({ email: user.email }).select("_id")
      if (existedUser) throw new CError(BAD_REQUEST, "User alrady exists")

      let validationError = user.validateSync()
      if (validationError) throw new CError(BAD_REQUEST, validationError.message)

      let salt = bCript.genSaltSync(10)
      user.password = bCript.hashSync(user.password, salt)

      let newUser = await user.save()

      if (!newUser) throw new CError(INTERNAL_SERVER_ERROR, "Error while creating user")
      return { data: newUser }

   }
   catch (e) { return { error: true, errorCode: e.errorCode || INTERNAL_SERVER_ERROR, message: e.message } }
}

exports.REGISTER_USER = async (req, res) => {
   try {
      let resp = await registerUser(req.body)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}

exports.loginUser = async (email, password) => {
   try {
      // Getting user
      let projection = "name email thumbnail status password"
      let user = await Users.findOne({ email }).select(projection)
      if (!user) return { error: true, message: "User not found with the email address" }

      // Checking is password exist
      if (user && !user.password)
         return { error: true, message: "No password" }

      // Matching passwords
      let valid = bCript.compareSync(password, user.password)
      if (!valid) return { error: true, message: "Invalid password" }

      // Signing json web token
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '168h' })

      // returning with token
      return { user: { ...user._doc, password: undefined }, token }

   }
   catch (error) { return { error: true, message: error.message } }
}

exports.onGoogleSignin = async (_, __, profile, done) => {

   let existUser = await Users.findOne({ email: profile._json.email }).select("-__v")

   if (existUser) {
      //let token = jwt.sign({ _id: existUser._id }, process.env.JWT_SECRET)
      //console.log(token)
      Users.updateOne({ _id: existUser._id }, { lastVisited: Date.now() })
      return done(null, existUser._doc, "User already exist!")
   }

   let user = new User({
      name: profile.displayName,
      email: profile._json.email,
      emailVerified: profile._json.email_verified,
      externalId: profile.id,
      provider: profile.provider,
      thumbnail: profile._json.picture
   })

   let isError = user.validateSync()
   if (isError !== undefined) { return done(true, null, "User validation error!") }

   await User.init()

   user.save()
      .then(newUser => {
         console.log("User created successfully!")
         //let token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET)
         //console.log(token)
         done(null, newUser, "User created successfully!")
      })
      .catch(err => {
         console.log(err.message)
         done(true, null, err.message)
      })
}

exports.registerUser = registerUser