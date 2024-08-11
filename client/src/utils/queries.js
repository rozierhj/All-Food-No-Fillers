import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      recipeCount
      savedRecipes {
        recipeId
        title
        image
      }
    }
  }

`;

export const GET_RECIPE_COMMENTS = gql`
  query RecipeComments($recipeId: Int!) {
    RecipeComments(recipeId: $recipeId) {
      _id
      text
      username
      recipeId
    }
  }
`;