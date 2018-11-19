const express = require('express')
const passport = require('passport')
const router = express.Router()

const User = require('../models/User')

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.user
  User.findById(id)
   .then(user => res.json(user.fullName))
})
router.post('/edit/:id', (req, res) => {
  const { id } = req.params
  const { fullName, email, password } = req.body
  User.findById(id)
   .then(user => {
     user.fullName = fullName
     user.email = email
     user.password = password
     user.save()
      .then(user => res.json(user))
   })
})
module.exports = router