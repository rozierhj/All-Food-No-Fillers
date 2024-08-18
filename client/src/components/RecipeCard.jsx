import { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Image } from 'react-bootstrap';
import Auth from '../utils/auth';
import {GET_ME} from '../utils/queries';
import {useMutation, useLazyQuery} from '@apollo/client';
import RecipeComments from './RecipeComments';
// import RecipeComment from './RecipeComment';
import {UPVOTE} from '../utils/mutations';
import './RecipeCard.css';
import { FaFacebook, FaTwitter, FaEnvelope, FaInstagram } from 'react-icons/fa';

// const URL=`https://api.spoonacular.com/recipes/${recipeId}/information`
// const API_KEY= "cdc727804129496c8ed7564453c15133";
// useEffect(() => {
//   async function fetchRecipe() {
//    const res= await fetch(`${URL}?apiKey=${API_KEY}`);
//    const data= res.json();
//    console.log(data);
//   }
//   fetchRecipe()
// }, [])

const RecipeCard = ({ show, handleClose, recipe }) => {

  //make sure the recipe prop was provided
  if (!recipe) {return null};

  //get user data
  const [getMe, { data: meData }] = useLazyQuery(GET_ME);
  //state to control if comments are visible
  const [showComments, setShowComments] = useState(false);
  //state to control is the add comment form is visible
  // const [showAddComment, setShowAddComment] = useState(false);
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
    // setShowAddComment(false);
  };

  //function for displaying add comment form
  // const handleAddCommentClick = () =>{

  //   //show form to add a new comment
  //   setShowAddComment(true);
  // };

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

  const shareUrl = window.location.href;
  const shareText = `check out this delicious recipe ${recipe.title}!`;

  return (
    <Modal show={show} onHide={handleClose} className='recipe-modal' dialogClassName='modal-dialog-centered'>
      <Modal.Header className='bg-danger font-bold ' closeButton>
        <Modal.Title>Delicious Recipe </Modal.Title>
      </Modal.Header>
      <Modal.Body className=' border-black the-recipe-card'>
        <Row>
          <Col md={8}>
            <h2 className={'recipe-title'}>{recipe.title}</h2>
          </Col>
          <Col md={4}>
          {
            recipe.image && (<Image 
              src={recipe.image}
              alt={`image for ${recipe.title}`}
              fluid
            />)
          }
          </Col>
        </Row>
        <ol>
          {recipe.steps.map((step, index)=> ( 
            <Row key={index} className="mt-4">
              <Col md={8}>
              <h4>Step {index + 1}</h4>
              <p>{step.step}</p>
              </Col>
            
            <Col md={4}>
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
        {Auth.loggedIn() && (
          <Button className='btn-block btn-dark mt-2' onClick={toggleComments}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </Button>
          )}
        {/* upvote button */}
        <Button className='btn-block btn-dark mt-2' onClick={handleUpvote}>Upvote</Button>
        <Button onClick={alert(window.location.href)} variant="primary" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank">
            <FaFacebook /> Share on Facebook
          </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecipeCard;