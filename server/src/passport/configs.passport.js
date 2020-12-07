exports.google = {
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   authorizationURL: "https://accounts.google.com/o/oauth2/auth",
   tokenURL: "https://oauth2.googleapis.com/token",
   callbackURL: "http://localhost:3875/auth/google/callback",
   scope: ['profile', "email"]
}