const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Todo = require('../models/Todo')

router.get('/', (req, res) => {
 Todo.find({})
  .then(todos => res.json(todos))
})
router.post('/', (req, res) => {
 const { title, category, description } = req.body.item
 const newTodo = {
  title,
  category,
  description
 }
 new Todo(newTodo).save()
 .then(todo => res.json(todo))
 .catch(err => res.status(400).json({msg: `something we wrong, please try again.`}))
})
router.put('/', (req, res) => {
 const { title, category, description } = req.body
 Todo.findOne({ _id: id })
  .then(todo => {
   todo.title = title,
   todo.category = category
   todo.description = description
   todo.save()
    .then(todo => res.json(todo))
  })
})
router.delete('/', (req, res) => {
 const { id } = req.body
 Todo.findOneAndRemove({ _id: id })
 .then(() => res.json({msg:`Item has been removed`}))
 .catch(err => console.log(`something we wrong, please try again.`))
})

module.exports = router