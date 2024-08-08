const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;
const Recipe = require('./Recipe');

const commentSchema = new Schema({
  username: {
    type: String,
  },
  recipe: {
    type: ObjectId,
    ref: 'Recipe',
  },
  text: {
    type: String,
  },
});

const Comment = model('Comment', commentSchema);
module.exports = Comment;