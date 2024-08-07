const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;
const Recipe = require('./Recipe');

const commentSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  recipe: {
    type: ObjectId,
    ref: 'Recipe',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const Comment = model('Comment', commentSchema);
module.exports = Comment;