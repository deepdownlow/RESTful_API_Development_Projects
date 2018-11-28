const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const router = express.Router()

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')

router.get('/', (req, res) => {
  Post.find()
   .sort({ date: -1})
   .then(posts => res.json(posts))
   .catch(err => res.status(404).json({error:`no post here`}))
})
router.get('/:id', (req, res) => {
  const { id } = req.params
  Post.findById(id)
   .then(post => res.json(post))
   .catch(err => res.status(404).json({error:`no post found`}))
})
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
 const { text, name, avatar } = req.body
 const newPost = {
  text,
  name,
  avatar,
  user: req.user.id
 }
 new Post(newPost).save()
  .then(post => res.json(post))
  .catch(err => res.status(500).json(err))
})
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params
  Profile.findOne({user: req.user.id})
   .then(profile => {
     Post.findById(id)
      .then(post => {
       if(post.user.toString !== req.user.id) {
         return res.status(401).json({error:'you are not authorized to make changes to this account'})
       }
       post.remove()
        .then(() => res.json({success: true}))
        .catch(err => res.status(404).json({error: 'post not found'}))
      })
   })
   .catch(err => console.log(err))
})
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params
 Profile.findOne({user: id})
  .then(profile => {
    Post.findById(id)
     .then(post => {
       if(post.like.filter(like => like.user.toString() === user.id).length > 0) {
         return res.status(400).json({error:`you have already liked this post`})
       } 
       post.like.unshift({user: req.user.id})
       post.save()
        .then(post => res.json(post))
        .catch(err => console.log(err))
     })
  })
  .catch(err => console.log(err))
})
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params
  Profile.findOne({user: id})
   .then(profile => {
     Post.findById(id)
      .then(post => {
        if(post.like.filter(like => like.user.toString() === user.id).length === 0) res.status(400).json({error:`you have not like this post`})
        const likeIndex = post.like.map(like => like.user.toString()).indexOf(req.user.id)
        post.like.splice(likeIndex, 1)
        post.save()
         .then(post => res.json(post))
         .catch(err => console.log(err))
      })
      .catch(err => res.status(500).json({error:`something went wrong, please try again later`}))
   })
   .catch(err => console.log(err))
})
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params
  const { text, name, avatar } = req.body
  Post.findById(id)
   .then(post => {
     const newComment = {
      text,
      name,
      user: req.user.id,
      avatar
     }
     post.comment.unshift(newComment)
     post.save()
      .then(post => res.json(post))
      .catch(err => console.log(err))
   })
   .catch(err => res.status(500).json({error: `something went wrong, please try again`}))
})
router.delete('/comment/:id/:commentId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id, commentId } = req.params
  Post.findById(id)
   .then(post => {
     if(post.comment.filter(comment => comment._id === commentId).length === 0) res.status(404).json({error:`post does not exist`})
     const commentIndex = post.comment.map(comment => comment._id).indexOf(commentId) 
     post.splice(commentIndex, 1)
     post.save()
      .then(post => res.json(post))
      .catch(err => console.log(err))
   })
   .catch(err => res.status(500).json({error:`something went wrong, please try again`}))
})

module.exports = router