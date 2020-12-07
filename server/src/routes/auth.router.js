const router = require('express').Router()
const passport = require('passport')
const auth = require('../controllers/auth.controller')

router.get("/api/", (req, res) => {
   req.user ? res.render("pages/auth", { user: req.user }) : res.redirect("/")
})

router.get("/api/login", (req, res) => {
   res.status(200).json({ from: "/login" })
})

// Login
router.post('/api/login', (req, res, next) => {
   req.body.username = JSON.stringify({ $or: [{ userName: req.body.username }, { email: req.body.username }] })
   passport.authenticate('local')(req, res, next);
}, (req, res) => {
   if (req.user) { res.status(200).json(req.user) }
   else {
      res.status(404).json({
         error: true,
         message: "User not found"
      })
   }
});

router.post("/api/register", auth.regiterUser)

router.get(`/api/google`, passport.authenticate('google'))
router.get(`/api/google/callback`, passport.authenticate('google', { successRedirect: "/auth" }))

module.exports = router