const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;
const Comment = require('./Comment');

const recipeSchema = new Schema({
  title: {
    type: String,
  },
  upVotes: {
    type: Number,
  },
  apiID: {
    type: Number,
  },
  ingredients: [{
    type: String,
  }],
  instructions: {
    type: String,
  },
  comments: [{
    type: ObjectId,
    ref: 'Comment',
  }],
});

const Recipe = model('Recipe', recipeSchema);
module.exports = Recipe;