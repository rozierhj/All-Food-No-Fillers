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
        steps {
          step
          ingredients
          ingredientsImage
        }
      }
    }
  }

`;

export const GET_RECIPE_COMMENTS = gql`
  query getRecipeComments($recipeId: Int!) {
    getRecipeComments(recipeId: $recipeId) {
      _id
      text
      username
      recipeId
    }
  }
`;

export const GET_RECIPE_REACTION = gql`

query getRecipeReaction($recipeId:Int!){
  getRecipeReaction(recipeId: $recipeId){
  _id
  upVotes
  }
}

`;

export const GET_WELCOME_VIDEO = gql`
  query getWelcomeVideo {
    getWelcomeVideo
 }
`;