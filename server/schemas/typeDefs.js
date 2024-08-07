// server/schemas/typeDefs.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    recipes: [Recipe]
    recipe(id: ID!): Recipe
    comments: [Comment]
    comment(id: ID!): Comment
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
`;

module.exports = typeDefs;