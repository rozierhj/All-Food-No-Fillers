import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RECIPE_COMMENTS } from '../utils/queries';
import { Spinner, ListGroup, Button } from 'react-bootstrap';
import RecipeComment from './RecipeComment';
import Auth from '../utils/auth';

const RecipeComments = ({ recipeId }) => {
  //state controls of the add comment form
  const [showAddComment, setShowAddComment] = useState(false);

  //execute get recipe comments query using the recipe id to find related comments
  const { loading, error, data } = useQuery(GET_RECIPE_COMMENTS, {
    variables: { recipeId },
  });

  //function handles click event for showing the add comment form
  const handleAddCommentClick = () =>{
    //turn on the add comment form
    setShowAddComment(true);
    console.log(recipeId);
  }

  //spinner icon if the comments are still loading
  if (loading) return <Spinner animation="border" />;

  //if there are no comments and that causes an error then show nothing
  if (error) return;

  return (
    <div>
      {/* display group for all comments if they exist */}
    <ListGroup>
      {data.RecipeComments.length > 0 ? (
        // map through the comments and show the username of the commenter followed by their comment
        data.RecipeComments.map((comment) => (
          <ListGroup.Item key={comment._id}>
            <strong>{comment.username}:</strong> {comment.text}
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>No comments yet.</ListGroup.Item>
      )}
    </ListGroup>
      {/* show add comment button if the user is logged in and the comment form is not already being shown */}
    {Auth.loggedIn()&& !showAddComment && (
      <Button variant='danger' onClick={handleAddCommentClick} className='mt-3'>
        Add Comment
      </Button>
    )}
    {/* show the add comment modal if showAddComment is true (user clicked add comment) */}
    {showAddComment && <RecipeComment recipeId={recipeId} />}
    </div>

  );

}
export default RecipeComments;