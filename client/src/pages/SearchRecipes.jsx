import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row,
} from 'react-bootstrap';
import Auth from '../utils/auth';
import axios from 'axios';
import {useMutation, useLazyQuery} from '@apollo/client';
import {GET_ME} from '../utils/queries';
import { SAVE_RECIPE } from '../utils/mutations';
import RecipeCard from '../components/RecipeCard';
import './SearchRecipes.css';
const URL = "https://api.spoonacular.com/recipes/complexSearch";
const API_KEY= "cdc727804129496c8ed7564453c15133";

const SearchRecipes = () => {
  // state holds recipes from the api after the search
  const [searchedRecipes, setSearchedRecipes] = useState([]);

  //state controls whether or not the modal with the individual recipecard can be seen
  const [showRecipeCard, setShowRecipeCard] = useState(false);

  //state holds the recipe data that will be on the recipecard
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    // Check if 'searchedRecipes' exists in localStorage
    const storedRecipes = localStorage.getItem('searchedRecipes');
    
    if (storedRecipes) {
      // If it exists, load the stored recipes into the state
      setSearchedRecipes(JSON.parse(storedRecipes));
    } else {
      // If it doesn't exist, initialize it with an empty array in localStorage
      localStorage.setItem('searchedRecipes', JSON.stringify([]));
    }
  }, []);


  //fetch the logged-in user's data (GET_ME query) when needed.
 const [getMe, {data: meData}] = useLazyQuery(GET_ME);

 //save a recipe 
  const [saveRecipe] = useMutation(SAVE_RECIPE,{

    //update the Apollo Client cache with the users new saved recipe
    update(cache, {data: {saveRecipe}}) {
      try{
        //get user data from the cache
          const {me} = cache.readQuery({query: GET_ME});

          //update the cache with the new saved recipe
          cache.writeQuery({
            query:GET_ME,
            data: {me: {...me, savedRecipes:[...me.savedRecipes, saveRecipe]}},
          });
      }
      catch(err){
        console.log('error in updating the cache after saving the recipe', err)
      }
    }
  });

  // search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      //spoonacular api where we get our recipes
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          query: searchInput,
          number: 5, //number of recipes being returned
          apiKey: `${API_KEY}`,
        },
      });
      console.log(response);
      if (!response) {
        throw new Error('something went wrong!');
      }
      //use keys from api return to retrieve an array of recipe objects
      const  items  = response.data.results;
      console.log(items);
      //go through results recipe array and pull required values
      const recipeData = items.map((recipe) => ({
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image || '',
      }));

      //update searchedRecipes state with the new recipe data
      setSearchedRecipes(recipeData);

      //store recipe in local storage so we can get them to persist if user refreshes the page
      localStorage.setItem('searchedRecipes', JSON.stringify(recipeData));
      //reset searchinput state
      setSearchInput('');

      //get user data who is logged in
      if (Auth.loggedIn()) {
        getMe();
      }

    } catch (err) {
      console.error(err);
    }
  };

  // saving a recipe to the users saved recipe array
  const handleSaveRecipe = async (recipeId) => {
    
    // find the recipe in `searchedRecipes` state by the matching id
    const recipeToSave = searchedRecipes.find((recipe) => recipe.recipeId === recipeId);

    //if use not authentice then leave
    if (!Auth.loggedIn()) {
      return false;
    }

    //adding the recipe to the existing database for that user
    try {
      await saveRecipe({
        variables: { ...recipeToSave },
      });

      // Fetch updated user data after saving the recipe
      getMe();
    } catch (err) {
      console.error('Error saving the recipe!', err);
    }
  };

  //function for showing a selected recipe via the recipeCard modal
  const handleShowRecipeCard = (recipe) =>{
    //get the redipe data
    setSelectedRecipe(recipe);
    //show the RecipeCard modal
    setShowRecipeCard(true);
  }

  //function for closing the recipe card
  const handleCloseRecipeCard = () =>{
    //hide the RecipeCard modal
    setShowRecipeCard(false);
    //clear the recipe card state data
    setSelectedRecipe(null);
  }

  //loop through all saved recipes and grab recpieId or return empty array
  const savedRecipeIds = meData?.me?.savedRecipes?.map(recipe => recipe.recipeId) || [];

  return (
    <>
      <div className="text-light bg-dark p-5">
        {/* container for the page header */}
        <Container>
          <h1>Find Delicious Recipes!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='bon appetit'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Find Recipe
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    <div className='recipes'>
      {/* container for the recipe search results */}
      <Container>
        <Row>
          {searchedRecipes.map((recipe) => (
            <Col className='oneCard' md="4" key={recipe.recipeId}>
              <Card border='dark'>
                {recipe.image && (
                  <Card.Img src={recipe.image} alt={`The cover for ${recipe.title}`} variant='top' />
                )}
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>Recipe Description</Card.Text>
                  {/* button controls if user can see RecipeCard with data specific to that recipe */}
                  <Button variant="primary" onClick={() => handleShowRecipeCard(recipe)}>
                    View Details
                  </Button>
                  {/* show this button only is a user is signed in */}
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedRecipeIds?.some((savedRecipeId) => savedRecipeId === recipe.recipeId)}
                      className='btn-block btn-info mt-2'
                      onClick={() => handleSaveRecipe(recipe.recipeId)}>
                      {savedRecipeIds?.some((savedRecipeId) => savedRecipeId === recipe.recipeId)
                        ? 'This recipe is a favorite!'
                        : 'Save this recipe!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
          </div>
          {/* modal for a single recipe that is selected by the user */}
          <RecipeCard
            show={showRecipeCard}
            handleClose={handleCloseRecipeCard}
            recipe={selectedRecipe}
          />
    </>
  );
};

export default SearchRecipes;
