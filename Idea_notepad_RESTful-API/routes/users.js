const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()


const User = require('../models/User')

router.get('/signin', (req, res) => res.render('./user/signIn'))
router.post('/signin', (req, res, next) => {
 passport.authenticate('local', {
   successRedirect: '/ideas',
   failureRedirect: '/user/signin',
   failureFlash: true
 })(req, res, next)
})
router.get('/signup', (req, res) => res.render('./user/signUp'))
router.post('/register', (req, res) => {
 const { firstname, lastname, email, password, password2 } = req.body
 const errors = []
 if(!firstname) errors.push({text: `first name is required`})
 if(!lastname) errors.push({text: `last name is required`})
 if(!email) errors.push({text: `email is required`})
 if(!password) errors.push({text: `password is required`})
 if(password !== password2) errors.push({text: `password does not match`})
 if(password.length < 8) errors.push({text: `password must be at least 8 characters long`})
 if(errors.length > 0) res.render('./user/signUp', {errors, firstname, lastname, email, username})
 else {
  User.findOne({email})
   .then(user => {
    if (user) {
     req.flash('error_msg','This Email has already been registered')
     res.render('./user/signUp')
    }
    else {
     const newUser = new User({firstname, lastname, email, password})
     bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
       if (err) throw err
       newUser.password = hash
       newUser.save()
        .then(user => {
         req.flash('success_msg', 'You have been registered and now can sign in')
         res.redirect('/user/signin')
        })
        .catch(err => console.log(err))
      })
     })
    }
   })
 }
})
router.get('/signout', (req, res) => {
 req.logOut()
 req.flash('success_message', 'You are signed out')
 res.redirect('/user/signin')
})

module.exports = router