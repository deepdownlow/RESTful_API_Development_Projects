const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

const User = require('../../models/User')


router.post('/register', (req, res) => {
 const { errors, isValid } = validateRegisterInput(req.body)
 if(!isValid) {
   return res.status(400).json(errors)
 }
 const { name, email, password } = req.body
 User.findOne({email})
  .then(user => {
   if (user) {
    return res.status(400).json({email: 'email already exists'})
   } else {
    const avatar = gravatar.url(email, {
     s:'200',
     r:'pg',
     d:'mm'
    })
    const newUser = { name, email, password, avatar }
    bcrypt.genSalt(10, (err, salt) => {
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
router.post('/login', (req, res) => {
 const { errors, isValid } = validateLoginInput(req.body)
 if(!isValid) {
   return res.status(400).json(errors)
 }
 const { email, password } = req.body
 User.findOne({email})
  .then(user => {
   if(!user) res.status(404).json({email:'User Not Found'})
   bcrypt.compare(password, user.password)
    .then(isMatch => {
     if(isMatch) {
      const payload = {id: user.id, name: user.name, avatar: user.avatar}
      jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
       res.json({success: true, token: `Bearer ${token}`})
      })
     } else {
      return res.status(400).json({error:'Incorrect Password'})
     }
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
})
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { name, email, id, avatar } = req.user
  const currentUser = {
    name,
    email,
    avatar,
    id
  }
})

module.exports = router