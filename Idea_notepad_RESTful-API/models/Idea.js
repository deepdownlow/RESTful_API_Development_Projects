const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IdeaSchema = new Schema ({
 user: {
  type: String,
  required: true
 },
 title : {
  type: String,
  require: true
 },
 detail : {
  type: String,
  require: true
 },
 date : {
  type: Date,
  default: Date.now()
 },
})

module.exports = Idea = mongoose.model('ideas', IdeaSchema)