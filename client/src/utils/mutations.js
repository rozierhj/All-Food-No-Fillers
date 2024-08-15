import { gql } from '@apollo/client';

export const ADD_FOODIE = gql`
  mutation addFoodie($username: String!, $email: String!, $password: String!) {
    addFoodie(username: $username, email: $email, password: $password) {
      token
      foodie {
        _id
        username
        email
      }
    }
  }
`;

export const LOGIN_FOODIE = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      foodie {
        _id
        username
        email
      }
    }
  }
`;

export const SAVE_RECIPE = gql`
  mutation saveRecipe($recipeId: Int!, $title: String, $image: String, $steps: [String]) {
    saveRecipe(recipeId: $recipeId,  title: $title, image: $image, steps: $steps) {
      _id
      username
      email
      savedRecipes {
        recipeId
        title
        image
        steps
      }
    }
  }
`;

export const REMOVE_RECIPE = gql`
  mutation removeRecipe($recipeId: Int!) {
    removeRecipe(recipeId: $recipeId) {
      _id
      username
      email
      savedRecipes {
        recipeId
        title
        image
        steps
      }
    }
  }
`;

export const ADD_COMMENT = gql`

mutation addComment($recipeId: Int!, $username: String!, $text: String!){
  addComment(recipeId:  $recipeId, username: $username, text: $text){
  
  _id
  text
  username
  recipeId
  
  }
}

`;

export const ADD_REACTION = gql`

  mutation addReaction($recipeId: Int!, $commentId: ID){
  addReaction(recipeId: $recipeId, commentId:$commentId){
    _id
    recipeId
    comments{
      _id
      text
      username
      recipeId
    }
  }
  }

`;

export const UPDATE_REACTION = gql`

  mutation updateReaction($reactionId: ID!, $commentId: ID){
    updateReaction(reactionId: $reactionId, commentId: $commentId){
      _id
      recipeId
      comments{
        _id
        text
        username
        recipeId
      }
    }
  }

`;

export const UPVOTE = gql`

mutation upvoteRecipe($recipeId: Int!){
  upvoteRecipe(recipeId: $recipeId){
    _id
    recipeId
    upVotes
  }

}

`;


