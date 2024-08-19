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

  mutation saveRecipe($recipeId: Int!, $title: String, $image: String, $steps: [StepInput]) {
    saveRecipe(recipeId: $recipeId,  title: $title, image: $image, steps: $steps) {

      _id
      username
      email
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
        steps{
          step
          ingredients
          ingredientsImage
        }
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

  mutation addReaction($recipeId: Int!){
  addReaction(recipeId: $recipeId){
      _id
      recipeId
      upVotes
      upVoters
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

export const UPVOTE_RECIPE = gql`

mutation upvoteRecipe($recipeId: Int!){
  upvoteRecipe(recipeId: $recipeId){
    _id
    recipeId
    upVotes
    upVoters
  }

}

`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($commentId: ID!) {
    removeComment(commentId: $commentId) {
      _id
      recipeId
      upVotes
      upVoters
      comments {
        _id
        text
        username
        recipeId
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      _id
      text
      username
      recipeId
    }
  }
`;

export const EDIT_COMMENT = gql`
  mutation editComment($commentId: ID!, $newText: String!) {
    editComment(commentId: $commentId, newText: $newText) {
      _id
      text
      username
      recipeId
    }
  }
`;