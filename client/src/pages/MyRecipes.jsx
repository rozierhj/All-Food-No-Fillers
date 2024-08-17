import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_RECIPE } from '../utils/mutations';
import { useState } from 'react';
import Auth from '../utils/auth';
import RecipeCard from '../components/RecipeCard';
import './MyRecipes.css';

const SavedRecipes = () => {

  //getting user data query
  const {loading, data } = useQuery(GET_ME);
  //state control for visibility or RecipeCard modal
  const [showRecipeCard, setShowRecipeCard] = useState(false);
  //state control of currently selected recipe in the RecipeCard modal
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  //removing a recipe from users favorites
  const [removeRecipe] = useMutation(REMOVE_RECIPE, {

    //update appolo clients cache
    update(cache, {data: {removeRecipe}}){
      try{

        //get users data from cache
        const {me} = cache.readQuery({query:GET_ME});
        //update the data in the cache
        cache.writeQuery({
          query: GET_ME,
          //filter out the recipe that was just removed using its id
          data: {me:{...me, savedRecipes: me.savedRecipes.filter(recipe => recipe.recipeId !== removeRecipe.recipeId),
            recipeCount: me.recipeCount - 1,
          }},
        });
      }
      catch(err){
        console.error('bad bad errors',err);
      }
    },
  });

  //deletes the recipe from the users favorite recipes list
  const handleDeleteRecipe = async (recipeId) => {

    //leave if user not authenticated
    if(!Auth.loggedIn()){
      return false;
    }

    try {
      //remove recipe mutation executed
      await removeRecipe({
        variables:{recipeId},
      });
    } 
    catch (err) {
      console.error(err);
    }
  };

  //getting users data
  const foodieData = data?.me || {};
  
  //functions shows the RecipeCard
  const handleShowRecipeCard = (recipe) =>{
    //get the correct recipe data for the card
    setSelectedRecipe(recipe);
    //show the RecipoeCard modal
    setShowRecipeCard(true);
  }

  //function to hide the RecipeCard
  const handleCloseRecipeCard = () =>{
    //hide the RecipeCard modal
    setShowRecipeCard(false);
    //clear the recipe data from the recipe state
    setSelectedRecipe(null);
  }

  // if data isn't here yet, say LOADING will test using email which is expected value
  if (foodieData.email === undefined || foodieData.email === null || foodieData.email ==='') {
    return <h2>LOADING...</h2>;
  }

  return (
    <div>
    
      <div fluid className="text-light bg-dark p-5">
      {/* header container */}
        <Container>
          <h1>Your Favorites 🧑‍🍳</h1>
        </Container>
      </div>
      {/* favorited recipes container */}
      <Container>
        <div  className='recipes'>
        <Row>
          {foodieData.savedRecipes.map((recipe) => {
            return (
              <Col md="4" className = 'oneCard'>
                <Card key={recipe.recipeId} border='dark' >
                  {recipe.image ? <Card.Img src={recipe.image} alt={`The cover for ${recipe.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                    {/* button for showing the reipe details in the RecipeCard model */}
                    <Button variant="warning" onClick={() => handleShowRecipeCard(recipe)}>
                    View Details
                  </Button>
                  {/* button for removing the recipe */}
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteRecipe(recipe.recipeId)}>
                      Remove from Favorites 🤢
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        </div>
      </Container>
      {/* modal with the recipe card */}
      <RecipeCard
            show={showRecipeCard}
            handleClose={handleCloseRecipeCard}
            recipe={selectedRecipe}
          />
    </div>

  );

};

export default SavedRecipes;
