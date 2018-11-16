const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { ensureAuthenticated } = require('../helpers/auth')

const Idea = require('../models/Idea')

router.get('/', ensureAuthenticated, (req, res) => {
 const { id } = req.user 
 Idea.find({user: id})
  .then(ideas => res.render('./ideas/ideas', {ideas}))
})
router.post('/', ensureAuthenticated, (req, res) => {
 const { title, detail } = req.body
 const errors = []
 if(!title) errors.push({text: `title must be provided`})
 if(!detail) errors.push({text: `detail must be provided`})
 if(errors.length > 0) res.render('./ideas/addIdea', { errors })
 else {
  const newIdea = {title, detail, user: req.user.id}
  new Idea(newIdea)
   .save()
   .then(idea => res.redirect('/ideas'))
 }
})
router.get('/addidea', ensureAuthenticated, (req, res) => res.render('./ideas/addidea'))
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  Idea.findOne({_id:id})
   .then(idea => {
     if(idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized')
      res.redirect('/ideas')
     } else {
       res.render('./ideas/editIdea', {idea})
     }
   })
})
router.put('/:id', ensureAuthenticated, (req, res) => {
 const { title, detail } = req.body
 const { id } = req.params
 Idea.findOne({_id:id})
  .then(idea => {
    idea.title = title
    idea.detail = detail
    idea.save()
     .then(idea => {
       req.flash('success_msg', 'Idea has been updated')
       res.redirect('/ideas')
     })
  })
})
router.delete('/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  Idea.deleteOne({_id: id})
   .then(() => {
    req.flash('success_msg', 'idea has been removed')
    res.redirect('/ideas')
   })
})
module.exports = router