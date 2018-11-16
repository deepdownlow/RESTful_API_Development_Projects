const localStrategy = require('passport-local').Strategy
const mongoose = require ('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = passport => {
 passport.use(new localStrategy({usernameFeild: 'email'}, (email, password, done) => {
  User.findOne({email})
   .then(user => {
    if(!user) {
     return done(null, false, {error: 'no user found'})
    } 
     bcrypt.compare(password, user.password)
      .then(isMatch => {
       if(isMatch) {
        return done(null, user)
       } else {
        return done(null, false, {error: 'Invalid password or username'})
       }
      })
      .catch(err => console.log(err))
   })
 }))
 passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
   .then(user => {
    done(null, user)
   })
   .catch(err => console.log(err))
});
}