const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;
const Comment = require('./Comment');

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  upVotes: {
    type: Number,
  },
  ingredients: [{
    type: String,
    required: true,
  }],
  instructions: {
    type: String,
    required: true,
  },
  comments: [{
    type: ObjectId,
    ref: 'Comment',
  }],
});

const Recipe = model('Recipe', recipeSchema);
module.exports = Recipe;