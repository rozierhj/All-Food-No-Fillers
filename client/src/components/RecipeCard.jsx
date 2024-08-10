import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const RecipeCard = ({ show, handleClose, recipe }) => {
  if (!recipe) return null;

  return (
    <Modal show={show} onHide={handleClose} className='recipes'>
      <Modal.Header closeButton>
        <Modal.Title>{recipe.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {recipe.image && (
          <img
            src={recipe.image}
            alt={`The cover for ${recipe.title}`}
            style={{ width: '100%' }}
          />
        )}
        <p>Recipe Description for {recipe.title}</p>
        {/* You can add more detailed information about the recipe here */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecipeCard;