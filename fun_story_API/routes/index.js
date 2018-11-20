const express = require('express')
const router = express.Router()
const { ensureAuthenticated, ensureNoLanding } = require('../helper/auth')

const Story = require('../models/Story')

router.get('/', ensureNoLanding, (req, res) => res.render('index/landing'))
router.get('/dashboard', ensureAuthenticated, (req, res) => {
 const { id } = req.user
 Story.find({ user: id })
  .then(stories => res.render('index/dashboard', { stories }))
  .catch(err => console.log(err))
})

module.exports = router