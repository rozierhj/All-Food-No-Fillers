import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import {GET_ME} from '../utils/queries';
import {useMutation, useLazyQuery} from '@apollo/client';
import RecipeComments from './RecipeComments';
import RecipeComment from './RecipeComment';
import {UPVOTE} from '../utils/mutations';


const RecipeCard = ({ show, handleClose, recipe }) => {

  //make sure the recipe prop was provided
  if (!recipe) {return null};

  //get user data
  const [getMe, { data: meData }] = useLazyQuery(GET_ME);
  //state to control if comments are visible
  const [showComments, setShowComments] = useState(false);
  //state to control is the add comment form is visible
  const [showAddComment, setShowAddComment] = useState(false);
  //state tracks if user has upvoted recipe
  const [upvoted, setUpvoted] = useState(false);
  //mutation for handeling upvote
  const [upvoteRecipe] = useMutation(UPVOTE);


  useEffect(() => {
    //fetch use data
    if (Auth.loggedIn()) {
      getMe();
    }
  }, []);

  //function controls if comments are visible
  const toggleComments = () => {
    //toggle comments show or hide state
    setShowComments(!showComments);
    //when toggling comments either showing or hiding the form to add comments should be off
    setShowAddComment(false);
  };

  //function for displaying add comment form
  const handleAddCommentClick = () =>{

    //show form to add a new comment
    setShowAddComment(true);
  };

  //function for upvoting recipes
  const handleUpvote = async () => {

    //confirm user is logged in and has not already upvoted the recipe
    if(Auth.loggedIn() && !upvoted){
      try{
        //upvote recipe mutation with the recipeId as a variable
        await upvoteRecipe({
          variables:{recipeId: recipe.recipeId},
        });
        //set recipe to upvoted for this user
        setUpvoted(true);
      } 
      catch(err){
        console.log('this was done in error', err);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className='recipes'>
      <Modal.Header closeButton>
        <Modal.Title>{recipe.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {recipe.image && (
          <img
            src={recipe.image}
            alt={`image for ${recipe.title}`}
            style={{ width: '100%' }}
          />
        )}
        <p>Recipe Description for {recipe.title}</p>
        {/* render comments when showComments is true when user selects details button */}
        {showComments && <RecipeComments recipeId={recipe.recipeId} />}
        {/* render the add comment button if the comments are visible and the user is logged in */}
        {/* {showComments && Auth.loggedIn() && !showAddComment && (
          <Button variant="primary" onClick={handleAddCommentClick} className="mt-3">
            Add Comment
            </Button>
        )} */}
        {/* render the new comment for if the user clicks the add comment button */}
        {showAddComment && <RecipeComment recipeId={recipe.recipeId}/>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {/* button to show comments only visible if user is logged in */}
        {Auth.loggedIn() && (
          <Button className='btn-block btn-info mt-2' onClick={toggleComments}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </Button>
          )}
        {/* upvote button */}
        <Button className='btn-block btn-info mt-2' onClick={handleUpvote}>Upvote</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecipeCard;