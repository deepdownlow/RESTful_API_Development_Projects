const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('./keys')

const User = require('../models/User')

module.exports = passport => {
 passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback',
  proxy: true
 }, (accessToken, refreshToken, profile, done) => {
  const img = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'))
  const newUser = {
   googleID: profile.id,
   firstName: profile.name.givenName,
   lastName: profile.name.familyName,
   email: profile.emails[0].value,
   img
  }
  User.findOne({googleID: profile.id})
   .then(user => {
    if(user) {
     done(null, user)
    } else {
     new User(newUser).save()
      .then(user => done(null, user))
      .catch(err => console.log(err))
    }
   })
   .catch(err => console.log(err))
 }))
 passport.serializeUser((user, done) => done(null, user))
 
 passport.deserializeUser((id, done) => {
   User.findById(id)
    .then(user => done(null, user))
    .catch(err => console.log(err))
 })
}