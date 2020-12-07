const jwt = require("jsonwebtoken")

exports.VERIFY_TOKEN = (req, res, next) => {
   let token = req.header("access-token")
   if (!token) { return res.status(401).json({ error: true, message: "Access denied!" }) }
   jwt.verify(token, process.env.JWT_SECRET,
      (err, decoded) => {
         if (err) res.status(401).json({ error: true, message: err.message })
         req.body = { ...req.body, _id: decoded._id }
         next()
      }
   )
}

exports.verifyToken = token => new Promise((resolve, reject) => {
   if (!token) { return reject({ error: true, message: "Access denied!" }) }
   jwt.verify(token, process.env.JWT_SECRET,
      (err, decoded) => {
         if (err) return reject({ error: true, message: err.message })
         resolve(decoded)
      }
   )
})