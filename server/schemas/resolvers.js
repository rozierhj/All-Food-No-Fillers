const { signToken, AuthenticationError } = require('../utils/auth');
const { Recipe, Comment, Foodie } = require('../models');

const resolvers = {
  Query: {
    recipes: async () => {
      return Recipe.find().populate('comments').populate({
        path:'comments',
        populate: 'recipe'
      });
    },
    recipe: async (parent, { id }) => {
      return Recipe.findById(id).populate('comments').populate({
        path:'comments',
        populate: 'recipe'
      });
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
    currentFoodie: async (parent, args, context) => {
      if (context.user) {
        return Foodie.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    addFoodie: async (parent, { username, email, password }) => {
      const foodie = await Foodie.create({ username, email, password });
      const token = signToken(foodie);

      return { token, foodie };
    },
    login: async (parent, { email, password }) => {
      const foodie = await Foodie.findOne({ email });

      if (!foodie) {
        throw AuthenticationError;
      }

      const correctPw = await foodie.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(foodie);
      return { token, foodie };
    },
    // removeFoodie: async (parent, args, context) => {
    //   if (context.user) {
    //     return Profile.findOneAndDelete({ _id: context.user._id });
    //   }
    //   throw AuthenticationError;
    // },

  },
};

module.exports = resolvers;