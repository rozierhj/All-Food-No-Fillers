import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RecipeCard.css"; // External CSS file for additional styling if needed

const RecipeCard = ({ recipeId }) => {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=YOUR_API_KEY`
        );
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching the recipe", error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <h2 className="recipe-title">{recipe.title}</h2>
      <p
        className="recipe-summary"
        dangerouslySetInnerHTML={{ __html: recipe.summary }}
      ></p>
      <a href={recipe.sourceUrl} className="recipe-button">
        View Recipe
      </a>
    </div>
  );
};

export default RecipeCard;
