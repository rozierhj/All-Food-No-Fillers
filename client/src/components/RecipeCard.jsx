import { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Image, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';
import {GET_ME, GET_RECIPE_REACTION} from '../utils/queries';
import {UPVOTE_RECIPE, ADD_REACTION, UPDATE_REACTION} from '../utils/mutations';
import {useMutation, useLazyQuery} from '@apollo/client';
import RecipeComments from './RecipeComments';
// import RecipeComment from './RecipeComment';
import './RecipeCard.css';

const RecipeCard = ({ show, handleClose, recipe }) => {

  //make sure the recipe prop was provided
  if (!recipe) {return null};

  //get user data
  const [getMe, { data: meData }] = useLazyQuery(GET_ME);
  const [username, setUsername] = useState('');
  //state to control if comments are visible
  const [showComments, setShowComments] = useState(false);
  //state to control is the add comment form is visible

  const [getRecipeReaction, {data:reactionData}] = useLazyQuery(GET_RECIPE_REACTION);
  const [upvotes, setUpvotes] = useState(recipe.upvotes || 0);
  const [upvoteRecipe] = useMutation(UPVOTE_RECIPE);
  
  useEffect(()=>{
    if(recipe){
      getRecipeReaction({variables:{recipeId:recipe.recipeId}})
    }
  },[recipe]);

  useEffect(()=>{
    if(reactionData?.getRecipeReaction){
      setUpvotes(reactionData.getRecipeReaction.upVotes || 0);
    }
  },[reactionData]);
  //state tracks if user has upvoted recipe
  // const [upvoted, setUpvoted] = useState(false);
  //mutation for handeling upvote

  useEffect(()=>{
    if(Auth.loggedIn()){
        getMe();
    }
}, [getMe]);

//update username state once we've got the user data
useEffect(()=>{
    if(meData){
        //username state set with current users username
        setUsername(meData.me.username);
    }
}, [meData]);

  

  //function controls if comments are visible
  const toggleComments = () => {
    //toggle comments show or hide state
    setShowComments(!showComments);
    //when toggling comments either showing or hiding the form to add comments should be off
  };
  
  //function for upvoting recipes
  const handleUpvote = async () => {

    //confirm user is logged in and has not already upvoted the recipe
      try{
        console.log(recipe.recipeId, username);
        //mutation for adding a comment is executed
       const {data} = await upvoteRecipe({
          variables:{recipeId:recipe.recipeId},
        });

        if(data?.upvoteRecipe){
          setUpvotes(data.upvoteRecipe.upVotes);
        }
        
    }
    catch(err){
        console.error('could not add upvote',err);
    }
    
  };

  return (
    <Modal show={show} onHide={handleClose} className='recipe-modal' dialogClassName='modal-dialog-centered'>
      <Modal.Header className='bg-danger font-bold ' closeButton>
        <Modal.Title>Delicious Recipe </Modal.Title>
      </Modal.Header>
      <Modal.Body className=' border-black the-recipe-card'>
        <Row className='card-header'>
          <Col md={8}>
            <h2 className={'recipe-title'}>{recipe.title}</h2>
          </Col>
          <Col md={4}>
          {
            recipe.image && (<Image className='recipe-image'
              src={recipe.image}
              alt={`image for ${recipe.title}`}
              fluid
            />)
          }
          </Col>
        </Row>
        <ol>
          {recipe.steps.map((step, index)=> ( 
            <Row key={index} className="mt-4 step-row">
              <Col md={7}>
              <h4>Step {index + 1}</h4>
              <p>{step.step}</p>
              </Col>
            
            <Col md={5}>
              <h4> Step {index +1} Ingredients</h4>
              <ul className='ingredients-list'>
                {step.ingredients.map((ingredient, ingIndex) =>(
                  <li key={ingIndex} className={'ingredient-item'}>
                    <div className='ingredient-name'>{ingredient}</div> 
                    <div className='image-container'>
                    {step.ingredientsImage[ingIndex] &&(
                      <Image 
                        src={`https://img.spoonacular.com/ingredients_100x100/${step.ingredientsImage[ingIndex]}`}
                        alt={`image of ${ingredient}`}
                        className='ingredient-image'
                      />
                    )}
                    </div>
                    </li>
                ))}
              </ul>
            </Col>
            </Row>
              // <li key={index}>{step.step}</li>
            ))}
        </ol>
        {showComments && <RecipeComments recipeId={recipe.recipeId} />}
      </Modal.Body>
      <Modal.Footer className='bg-danger'>
        <Button variant="dark" onClick={handleClose}>
          Close
        </Button>
        {/* button to show comments only visible if user is logged in */}
        {
          <Button className='btn-block btn-dark mt-2' onClick={toggleComments}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </Button>
          }
        {/* upvote button */}
        <Button className=' upvote-button bg-danger' onClick={handleUpvote}>
          <span className="upvote-count">{upvotes}</span>
          <span className="upvote-arrow">⬆️</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecipeCard;