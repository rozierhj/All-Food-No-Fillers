const { Foodie, Comment, Reaction } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {

    // Get the currently authenticated user
    me: async (parent, args, context) => {

      if (context.foodie) {

        //show users saved recipies
        return Foodie.findOne({ _id: context.foodie._id }).populate('savedRecipes');
      }
      throw new AuthenticationError('You must be logged in!');
    },

    //get the comments from a specific recipe
    RecipeComments: async (parent, { recipeId }) => {
      return Comment.find({ recipeId });
    },

    getWelcomeVideo: async () => {
      const videoUrl = '/assets/welcome.mp4';
      return videoUrl;
    }
  },

  Mutation: {

    // Add a new user
    addFoodie: async (parent, { username, email, password }) => {

      //data from signup table
      const foodie = await Foodie.create({ username, email, password });

      //the JWT token
      const token = signToken(foodie);
      return { token, foodie };
    },

    // Log in a user
    login: async (parent, { email, password }) => {

      //find the user using their email
      const foodie = await Foodie.findOne({ email });

      if (!foodie) {
        throw new AuthenticationError('Incorrect credentials');
      }

      //test password
      const correctPw = await foodie.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      //JWT token for signed in user
      const token = signToken(foodie);
      return { token, foodie };
    },

    // add recipe to users favorited recipes
    saveRecipe: async (parent, {recipeId, title, image }, context) => {
      if (context.foodie) {
        const updatedFoodie = await Foodie.findByIdAndUpdate(
          { _id: context.foodie._id },//find user with id
          { $addToSet: { savedRecipes: { recipeId, title, image} } },//add data as object to recipes array
          { new: true }//update the document
        ).populate('savedRecipes');

        return updatedFoodie;
      }
      throw new AuthenticationError('You must be logged in!');
    },

    // Remove a favorited recipe
    removeRecipe: async (parent, { recipeId }, context) => {
      if (context.foodie) {
        //find the foodie by their id
        const updatedFoodie = await Foodie.findByIdAndUpdate(
          { _id: context.foodie._id },
          { $pull: { savedRecipes: { recipeId } } },//pull the recipe from the foodies favorited recipes
          { new: true }//update document
        ).populate('savedRecipes');

        return updatedFoodie;
      }
      throw new AuthenticationError('You must be logged in!');
    },

    //add a comment to a recipe
    addComment: async (parent, {recipeId, username, text}, context) =>{
      if(context.foodie){
        //create comment, must provide comment text, users username and the id of the recipe they are commenting on
        const newComment = await Comment.create({
          text,
          username,
          recipeId,
        });

        let reaction = await Reaction.findOne({recipeId});

        if(reaction){
          await resolvers.Mutation.updateReaction(parent,{reactionId: reaction._id, commentId: newComment._id})
        }
        else{
          await resolvers.Mutation.addReaction(parent,{recipeId: recipeId, commentId: newComment._id})
        }
        
       return newComment;

      }
      throw new AuthenticationError('You must be logged in to add a comment');
    },

    addReaction: async(parent,{recipeId, commentId}) =>{
      const newReaction = await Reaction.create({recipeId:recipeId, comments: [commentId], upVotes: 0 });
      return newReaction;
    },

    updateReaction: async(parent, {reactionId, commentId }) =>{

      const updatedReaction = await Reaction.findByIdAndUpdate(reactionId,
        {$addToSet:{comments:commentId}},
        {new: true}
      ).populate('comments');
      return updatedReaction;

    },
    //add an upvote to a recipe
    upvoteRecipe: async (parent, {recipeId}, context) => {
      if(!context.foodie){
        throw new AuthenticationError('You need to log in');
      }

      //test if the recipe is in the reactions collection
      let reaction = await Reaction.findOne({recipeId});

      //if recipe is in the reactions collection then increase its upvotes by one
      if(reaction){
        reaction.upVotes += 1;
      }
      else{
        //if recipe was not in reactions collection then add it to the collection and set its upvotes to one
        reaction = await Reactions.create({
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