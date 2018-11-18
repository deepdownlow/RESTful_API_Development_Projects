const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.get('/:id', (req, res) => {
 const { id } = req.params
 User.findById(id)
  .then(user => {
   const currentProfile = { name: user.fullName, email: user.email }
   res.json(currentProfile)
  })
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