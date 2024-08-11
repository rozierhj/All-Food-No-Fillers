import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import {GET_ME} from '../utils/queries';
import {useMutation, useLazyQuery} from '@apollo/client';
import RecipeComments from './RecipeComments';


const RecipeCard = ({ show, handleClose, recipe }) => {

  if (!recipe) {return null};

  const [getMe, { data: meData }] = useLazyQuery(GET_ME);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (Auth.loggedIn()) {
      getMe();
    }
  }, []); // Empty dependency array means this effect runs once on mount

  const toggleComments = () => {
    setShowComments(!showComments);
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
        {Auth.loggedIn() && (
          <Button className='btn-block btn-info mt-2' onClick={toggleComments}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </Button>
          )}
        <RecipeComments />
      </Modal.Footer>
    </Modal>
  );
};

export default RecipeCard;