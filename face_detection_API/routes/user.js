const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../config/keys')
const router = express.Router()

const User = require(`../models/User`)

router.get('/members', (req, res) => {
 User.find({})
  .then(users => res.json(users))
})
router.post('/signin', (req, res) => {
 const { email, password } = req.body
 User.findOne({email})
  .then(user => {
   if(!user) res.status(400).json({error: `user not found`})
   bcrypt.compare(password, user.password)
    .then(isMatch => {
     if(isMatch){
      const payload = { id: user.id, name: user.fullName }
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({success: `true`, token: `Bearer ${token}`})
      })
     } else {
      res.status(400).json({error: `Invalid password`})
     }
    })
    .catch(err => console.log(err))
  })
})
router.post('/register', (req, res) => {
 const { fullName, email, password } = req.body
 User.findOne({email})
  .then(user => {
   if(user) {
    res.status(400).json({error: `user already exists `})
   }
   else {
    const newUser = {
     fullName,
     email,
     password
    }
    bcrypt.genSalt(10,(err, salt) => {
     bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err
      newUser.password = hash
      new User(newUser).save()
       .then(user => res.json(user))
       .catch(err => console.log(err))
     })
    })
   }
  })
  .catch(err => console.log(err))
})
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.user
  User.findById(id)
   .then(user => {
     const currentUser = {
       name: user.fullName,
       email: user.email
     }
     res.json(currentUser)
   })
})
router.delete('/delete-account', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.user
  User.findByIdAndDelete(id)
   .then(() => res.json({msg:`account has been deleted`}))
   .catch(err => console.log(err))
})

module.exports = router

