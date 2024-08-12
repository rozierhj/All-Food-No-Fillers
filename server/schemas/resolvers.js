const { Foodie } = require('../models');
const { Comment } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {

    // Get the currently authenticated user
    me: async (parent, args, context) => {
      if (context.foodie) {
        return Foodie.findOne({ _id: context.foodie._id }).populate('savedRecipes');
      }
      throw new AuthenticationError('You must be logged in!');
    },
    RecipeComments: async (parent, { recipeId }) => {
      return Comment.find({ recipeId });
    },
  },

  Mutation: {

    // Add a new user
    addFoodie: async (parent, { username, email, password }) => {
      const foodie = await Foodie.create({ username, email, password });
      const token = signToken(foodie);
      return { token, foodie };
    },

    // Log in a user
    login: async (parent, { email, password }) => {
      const foodie = await Foodie.findOne({ email });

      if (!foodie) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await foodie.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(foodie);
      return { token, foodie };
    },

    // Save a book to the user's savedBooks array
    saveRecipe: async (parent, {recipeId, title, image }, context) => {
      if (context.foodie) {
        const updatedFoodie = await Foodie.findByIdAndUpdate(
          { _id: context.foodie._id },
          { $addToSet: { savedRecipes: { recipeId, title, image} } },
          { new: true }
        ).populate('savedRecipes');

        return updatedFoodie;
      }
      throw new AuthenticationError('You must be logged in!');
    },

    // Remove a book from the user's savedBooks array
    removeRecipe: async (parent, { recipeId }, context) => {
      if (context.foodie) {
        const updatedFoodie = await Foodie.findByIdAndUpdate(
          { _id: context.foodie._id },
          { $pull: { savedRecipes: { recipeId } } },
          { new: true }
        ).populate('savedRecipes');

        return updatedFoodie;
      }
      throw new AuthenticationError('You must be logged in!');
    },

    addComment: async (parent, {recipeId, username, text}, context) =>{
      if(context.foodie){
        const newComment = await Comment.create({
          text,
          username,
          recipeId,
        });
        return newComment;
      }
      throw new AuthenticationError('You must be logged in to add a comment');
    },

    upVote: async (parent, {recipeId}, context) => {
      if(!context.foodie){
        throw new AuthenticationError('You need to log in');
      }

      let reaction = await Reaction.findOne({recipeId});

      if(reaction){
        reaction.upVotes += 1;
      }
      else{
        reaction = await Reaction.create({
          recipeId,
          upVotes: 1,
          comments: [],
        });
      }

      await reaction.save();
      return reaction;
    },
  },
};

module.exports = resolvers;