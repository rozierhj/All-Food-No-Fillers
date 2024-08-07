const { signToken, AuthenticationError } = require('../utils/auth');
const { Recipe, Comment, Foodie } = require('../models');

const resolvers = {
  Query: {
    recipes: async () => {
      return Recipe.find().populate('comments');
    },
    recipe: async (parent, { id }) => {
      return Recipe.findById(id).populate('comments');
    },
    comments: async () => {
      return Comment.find().populate('recipe');
    },
    comment: async (parent, { id }) => {
      return Comment.findById(id).populate('recipe');
    },
    foodies: async () => {
        return Foodie.find().populate('comments').populate('favorites');
    },
    foodie: async (parent, { id }) => {
        return Foodie.findById(id).populate('comments').populate('favorites');
    },
  },
};

module.exports = resolvers;