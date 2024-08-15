const typeDefs = `
  # Define the Recipe type
  type Recipe {
    _id: ID
    recipeId: Int
    title: String
    image: String
    steps: [String]
  }

  # Define the Foodie type
  type Foodie {
    _id: ID
    username: String!
    email: String!
    password: String!
    recipeCount: Int
    savedRecipes: [Recipe]
  }

  # Define the Query type
  type Query {
    me: Foodie
  }

  #Define Comment type
  type Comment {
  _id: ID
  text: String
  username: String
  recipeId: Int
}

 #define the Reaction type
 type Reaction {
 _id: ID
 recipeId: Int,
 upVotes: Int,
 comments: [Comment]
 }

extend type Query {
  RecipeComments(recipeId: Int!): [Comment]
}

  # Define the Mutation types
  type Mutation {

    login(email: String!, password: String!): Auth

    addFoodie(username: String!, email: String!, password: String!): Auth

    saveRecipe(recipeId: Int, title: String, image: String, steps: String!): Foodie

    removeRecipe(recipeId: Int!): Foodie

    addComment(recipeId: Int!, username: String!, text: String!): Comment

    upvoteRecipe(recipeId: Int!): Reaction
  
  }

  # Define the Auth type to handle authentication responses
  type Auth {
    token: ID!
    foodie: Foodie
  }
`;

module.exports = typeDefs;