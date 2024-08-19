const {gql} = require('apollo-server-express');

const typeDefs = gql`

 #define step input

 input StepInput{
 step: String!
 ingredients: [String]
 ingredientsImage: [String]
 }

  type Recipe {
    _id: ID
    recipeId: Int
    title: String
    image: String
    steps: [Step]
  }

  type Step{
    step: String
    ingredients:[String]
    ingredientsImage:[String]
  }

  type Foodie {
    _id: ID
    username: String!
    email: String!
    password: String!
    recipeCount: Int
    savedRecipes: [Recipe]
  }

  type Query {
    me: Foodie
    getRecipeComments(recipeId: Int!): [Comment]
    getWelcomeVideo: String
    getRecipeReaction(recipeId: Int!): Reaction
  }
  
  type Comment {
  _id: ID
  text: String
  username: String
  recipeId: Int
}

 type Reaction {
 _id: ID
 recipeId: Int!
 upVotes: Int
 comments: [Comment]
 upVoters: [ID]
 }



  # Define the Mutation types
  type Mutation {

    login(email: String!, password: String!): Auth

    addFoodie(username: String!, email: String!, password: String!): Auth

    saveRecipe(recipeId: Int, title: String, image: String, steps: [StepInput]): Foodie

    removeRecipe(recipeId: Int!): Foodie

    addComment(recipeId: Int!, username: String!, text: String!): Comment

    addReaction(recipeId: Int!): Reaction

    updateReaction(reactionId: ID!, commentId: ID, upVotes: Int): Reaction

    upvoteRecipe(recipeId: Int!): Reaction

    deleteComment(commentId: ID!): Comment

    removeComment(commentId: ID!): Reaction

    editComment(commentId: ID!, newText: String!): Comment

  }

  # Define the Auth type to handle authentication responses
  type Auth {
    token: ID!
    foodie: Foodie
  }
`;

module.exports = typeDefs;