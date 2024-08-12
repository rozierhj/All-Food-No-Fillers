const { Schema } = require('mongoose');

//schema to hold recipes in the users model
const recipeSchema = new Schema({
 
  recipeId: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = recipeSchema;