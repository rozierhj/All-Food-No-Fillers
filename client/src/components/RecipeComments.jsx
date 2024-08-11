import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RECIPE_COMMENTS } from '../utils/queries';
import { Spinner, ListGroup, Button } from 'react-bootstrap';
import RecipeComment from './RecipeComment';

const RecipeComments = ({ recipeId }) => {
  const [showAddComment, setShowAddComment] = useState(false);
  const { loading, error, data } = useQuery(GET_RECIPE_COMMENTS, {
    variables: { recipeId },
  });

  const handleAddCommentClick = () =>{
    setShowAddComment(true);
    console.log(recipeId);
  }

  if (loading) return <Spinner animation="border" />;
  if (error) return;

  return (
    <div>
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
    {Auth.loggedIn()&& !showAddComment && (
      <Button variant='primary' onClick={handleAddCommentClick} className='mt-3'>
        Add Comment
      </Button>
    )}
    {showAddComment && <RecipeComment recipeId={recipeId} />}
    </div>

  );

}
export default RecipeComments;