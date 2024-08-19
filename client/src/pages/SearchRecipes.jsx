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
import {GET_ME, GET_RECIPE_REACTION} from '../utils/queries';
import { SAVE_RECIPE } from '../utils/mutations';
import RecipeCard from '../components/RecipeCard';
import './SearchRecipes.css';
import WelcomeVideoModal from '../components/WelcomeVideoModal';
const SEARCH_KEY = import.meta.env.VITE_API_KEY;


const URL = "https://api.spoonacular.com/recipes/complexSearch";

const SearchRecipes = () => {
  
  //number of recipes API will return in search
  const [numberOfRecipes, setNumberOfRecipes] = useState(10); 

  //recipes from the api after the search
  const [searchedRecipes, setSearchedRecipes] = useState([]);

  // current search text
  const [searchTerm, setSearchTerm] = useState('');

  //controls if user can see individual recipe detail card
  const [showRecipeCard, setShowRecipeCard] = useState(false);

  //recipe data that will be on the recipecard
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // user input in the search form
  const [searchInput, setSearchInput] = useState('');

  //controls if user can see opening signup modal
  const [showVideoModal, setShowVideoModal] = useState('');

  //ids of the recipes the user saved
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);

  //get logged in users data
 const [getMe, {data: meData, refetch}] = useLazyQuery(GET_ME);

 //get the reaction to a recipe
  const [getRecipeReaction, {data:reactionData}] = useLazyQuery(GET_RECIPE_REACTION);

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

    //check local storage for key to determine is this is users first login and video should be played
    if (localStorage.getItem('firstLogin')){
      setShowVideoModal(true);
      localStorage.removeItem('firstLogin');
    }
  }, []);

  //refetch user data if they are loggedin
  useEffect(()=>{
    if(Auth.loggedIn()){
      refetch();
    }
  },[refetch]);

 //save a recipe to users saved recipe list
  const [saveRecipe] = useMutation(SAVE_RECIPE,{

    //update the Apollo Client cache with the users new saved recipe
    update(cache, {data: {saveRecipe}}) {
      try{
        //get user data from the cache
          const {me} = cache.readQuery({query: GET_ME});

          //update the cache with the new saved recipe
          cache.writeQuery({
            query:GET_ME,
            data: {me: {...me, savedRecipes:[...me.savedRecipes, saveRecipe.savedRecipes.pop()]}},
          });
      }
      catch(err){
        console.log('error in updating the cache after saving the recipe', err)
      }
    }
  });

  useEffect(()=>{
    if(meData){
      const savedIds = meData.me.savedRecipes.map(recipe=>recipe.recipeId)
      setSavedRecipeIds(savedIds);
    }
  },[meData]);

  
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    setSearchTerm(searchInput);

    try {
      //spoonacular api where we get our recipes
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          query: searchInput,
          number: numberOfRecipes, //number of recipes being returned
          apiKey: `${SEARCH_KEY}`,
        },
      });

      if (!response) {
        throw new Error('something went wrong!');
      }
      //use keys from api return to retrieve an array of recipe objects
      const  items  = response.data.results;
      
      //go through results recipe array and pull required values
      const recipeData = items.map((recipe) => ({
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image || '',
        steps: [],
        
      }));
      
      for (let i =0; i < recipeData.length; i++){

        const detail= await axios.get
        (`https://api.spoonacular.com/recipes/${recipeData[i].recipeId}/information`, 
          {
              params: {            
                apiKey: `${SEARCH_KEY}`,
              },
              });

              if(detail.data.analyzedInstructions[0] !== null && detail.data.analyzedInstructions[0] !== undefined){

              let stepsList = detail.data.analyzedInstructions[0].steps;

              for(let stp = 0; stp < stepsList.length; stp++){

                let oneStep = {
                  step: stepsList[stp].step,
                  ingredients:[],
                  ingredientsImage:[]
                }

                for(let ing = 0; ing <stepsList[stp].ingredients.length; ing++){
                  oneStep.ingredients.push(stepsList[stp].ingredients[ing].name);
                  oneStep.ingredientsImage.push(stepsList[stp].ingredients[ing].image);
                }
                recipeData[i].steps.push(oneStep);
              }
            }

      };

      //update searchedRecipes state with the new recipe data
      setSearchedRecipes(recipeData);

      //store recipe in local storage so we can get them to persist if user refreshes the page
      localStorage.setItem('searchedRecipes', JSON.stringify(recipeData));
      //reset searchinput state
      setSearchInput('');

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
  const handleShowRecipeCard = async (recipe) =>{

    try{
        const {data: reactionData } = await getRecipeReaction({
          variables:{recipeId: recipe.recipeId},
        });

        const upvotes = reactionData?.getRecipeReaction?.upVotes || 0;
        recipe.upvotes = upvotes;
    }
    catch(err){
      console.error(err);
      recipe.upvotes = 0;
    }
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
  // const savedRecipeIds = meData?.me?.savedRecipes?.map(recipe => recipe.recipeId) || [];

  const handleCloseVideoModal = () =>{
    setShowVideoModal(false);
  }

  return (
    <>
      <div className="text-light bg-warning p-5">
        {/* container for the page header */}
        <Container >
          
          <Form onSubmit={handleFormSubmit} className='search-form'>
          <h1 className='text-black' >Find Delicious Recipes!</h1>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='bon appetit'
                />
                <h5>Number of Recipes to Search</h5>
                <Form.Control
              as="select"
              className="ml-2"
              style={{ width: '80px', display: 'inline-block' }}
              value={numberOfRecipes}
              onChange={(e) => setNumberOfRecipes(e.target.value)}
            >
              {[...Array(20)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Form.Control>
                <Button type='submit' variant='danger' size='lg' className='text-black border-black  '>
                  Find Recipe
                </Button>
          </Form>
        </Container>
      </div>
    <div className='recipes'>
      {/* container for the recipe search results */}
      <Container>
        {searchTerm && (
          <h3 className='text-center search-text'>Search results for "{searchTerm}" 🧑‍🍳</h3>
        )}
        <Row>
          {searchedRecipes.map((recipe) => (
            <Col className='oneCard' md="4" key={recipe.recipeId}>
              <Card border='secondary'>
                {recipe.image && (
                  <Card.Img src={recipe.image} alt={`The cover for ${recipe.title}`} variant='top' />
                )}
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  {/* <Card.Text>Steps</Card.Text> */}
                  {/* button controls if user can see RecipeCard with data specific to that recipe */}
                  <Button variant="danger" onClick={() => handleShowRecipeCard(recipe)}>
                    View Details
                  </Button>
                  {/* show this button only is a user is signed in */}
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedRecipeIds?.some((savedRecipeId) => savedRecipeId === recipe.recipeId)}
                      className='btn-block btn-warning mt-2 text-white '
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
          <WelcomeVideoModal show={showVideoModal} handleClose={handleCloseVideoModal}/>
    </>
  );
};

export default SearchRecipes;
