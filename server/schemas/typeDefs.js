// server/schemas/typeDefs.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    foodies: [Foodie]
    foodie(id: ID!): Foodie
    recipes: [Recipe]
    recipe(id: ID!): Recipe
    comments: [Comment]
    comment(id: ID!): Comment
    currentFoodie: Foodie
  }

    type Foodie {
    _id: ID
    username: String
    email: String
    password: String
    favorites: [Recipe]
    comments: [Comment]
  }

    type Auth {
    token: ID!
    foodie: Foodie
  }

  type Recipe {
    _id: ID
    title: String
    ingredients: [String]
    instructions: String
    comments: [Comment]
  }

  type Comment {
    _id: ID
    username: String
    recipe: Recipe
    text: String
  }

  type Mutation {
    addFoodie(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;