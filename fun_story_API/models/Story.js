const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StorySchema = new Schema({
 title: {
  type: String,
  required:true
 },
 desc: {
  type: String,
  required: true
 },
 status: {
  type: String,
  default: 'public'
 },
 allowComments: {
  type: Boolean,
  default: false
 },
 comments: [{
  commentDesc: {
   type: String,
   required: true
  },
  commentDate: {
   type: Date,
   default: Date.now
  },
  commentUser: {
   type: Schema.Types.ObjectId,
   ref:'user'
  }
 }],
 user: {
   type: Schema.Types.ObjectId,
   ref:'user'
 },
 date: {
  type: Date,
  default: Date.now
 }
})

module.exports = Story = mongoose.model('story', StorySchema)