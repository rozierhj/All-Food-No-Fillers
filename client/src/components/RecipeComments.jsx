import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RECIPE_COMMENTS } from '../utils/queries';
import { Spinner, ListGroup } from 'react-bootstrap';

const RecipeComments = ({ recipeId }) => {
  const { loading, error, data } = useQuery(GET_RECIPE_COMMENTS, {
    variables: { recipeId },
  });

  if (loading) return <Spinner animation="border" />;
  if (error) return;

  return (
    <ListGroup>
      {data.RecipeComments.length > 0 ? (
        data.RecipeComments.map((comment) => (
          <ListGroup.Item key={comment._id}>
            <strong>{comment.username}:</strong> {comment.text}
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>No comments yet.</ListGroup.Item>
      )}
    </ListGroup>
  );

}
export default RecipeComments;