const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../helper/auth')

const Story = require('../models/Story')

router.get('/', (req, res) => {
 Story.find({status: 'public'})
  .populate('user')
  .then(stories => {
   res.render('stories/index', { stories }) 
  })
  .catch(err => console.log(err))
})
router.post('/', ensureAuthenticated, (req, res) => {
 const { title, desc, allowComments, status } = req.body
 const { id } = req.user
 let allowComment
 if(allowComments) {
  allowComment = true
 } else {
  allowComment = false
 }
 const newStory = {
  title,
  desc,
  allowComment,
  status,
  user: id
 }
 new Story(newStory).save()
  .then(story => res.redirect(`/stories/show/${story.id}`))
  .catch(err => console.log(err))
})
router.get('/show/:id', (req, res) => {
  const { id } = req.params
  Story.findById(id)
   .populate('user')
   .then(story => res.render('stories/show', { story }))
   .catch(err => console.log(err))
})
router.get('/add', ensureAuthenticated, (req, res) => res.render('stories/add'))
router.get('/edit/:id', (req, res) => {
  const { id } = req.params
  Story.findById(id)
   .then(story => res.render('stories/edit', { story }))
   .catch(err => console.log(err))
})
router.put('/:id', (req, res) => {
  const { title, desc, allowComments, status } = req.body
  const { id } = req.params
  let allowComment
  if(allowComments) {
   allowComment = true
  } else {
   allowComment = false
  }
  Story.findById(id)
   .then(story => {
     story.title = title,
     story.dessc = desc,
     story.allowComments = allowComment
     story.status = status
     story.save()
      .then(story => res.redirect('/'))
      .catch(err => console.log(err))
   })
   .catch(err => console.log(err))
})
router.delete('/:id', (req, res) => {
 const { id } = req.params
 Story.findByIdAndDelete(id)
  .then(() => res.redirect('/dashboard'))
})

module.exports = router