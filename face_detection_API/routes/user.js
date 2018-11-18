const express = require('express')
const bcrypt = require('bcryptjs')
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
      res.json({success: `true`, user: user.email})
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
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params
  User.findByIdAndDelete(id)
   .then(() => res.json({msg: `user has been removed from our database`}))
   .catch(err => console.log(err))
})

module.exports = router

