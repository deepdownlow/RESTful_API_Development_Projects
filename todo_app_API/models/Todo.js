const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
 title: {
  type: String,
  require: true
 },
 category: {
  type: String,
  require: true
 },
 description: {
  type: String,
  require: true
 },
 done: {
  type: Boolean,
  default: false
 },
 date: {
  type: Date,
  default: Date.now
 }
})

module.exports = Todo = mongoose.model('todo', TodoSchema)