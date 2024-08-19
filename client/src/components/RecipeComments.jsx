import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_RECIPE_COMMENTS } from '../utils/queries';
import { REMOVE_COMMENT, DELETE_COMMENT } from '../utils/mutations';
import { Spinner, ListGroup, Button } from 'react-bootstrap';
import RecipeComment from './RecipeComment';
import Auth from '../utils/auth';
import './RecipeComments.css';

const RecipeComments = ({ recipeId }) => {
  //state controls of the add comment form
  const [showAddComment, setShowAddComment] = useState(false);
  const [editingComment, setEditingComment] = useState(null);

  //execute get recipe comments query using the recipe id to find related comments
  const { loading, error, data, refetch } = useQuery(GET_RECIPE_COMMENTS, {
    variables: { recipeId },
  });

  const [removeComment] = useMutation(REMOVE_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  const handleDeleteComment = async (commentId) => {
    try {
      // Step 1: Remove the comment from its associated reaction
      // alert(commentId);
      await removeComment({
        variables: { commentId },
      });
      
      // Step 2: Delete the comment from the database
      await deleteComment({
        variables: { commentId },
      });

      refetch(); // Refetch comments to update the UI
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleEditCommentClick = (comment) => {
    setEditingComment(comment); // set the comment to be edited
    setShowAddComment(true); // show the comment form for editing
  };
  //function handles click event for showing the add comment form
  const handleAddCommentClick = () =>{
    //turn on the add comment form
    setEditingComment(null);
    setShowAddComment(true);
  }

  const handleCloseCommentAdded = () =>{
    setShowAddComment(false);
    refetch();
    
  }
  //spinner icon if the comments are still loading
  if (loading) return <Spinner animation="border" />;

  //if there are no comments and that causes an error then show nothing
  if (error) return;

  return (
    <div className='comment-section'>
      {/* display group for all comments if they exist */}
    <ListGroup className='comment-list'>
      {data.getRecipeComments.length > 0 ? (
        // map through the comments and show the username of the commenter followed by their comment
        data.getRecipeComments.map((comment) => (
          <ListGroup.Item key={comment._id} className='comment-item'>
            <div>
            <strong className='comment-username'>{comment.username}:</strong> 
            <span className='comment-text'>{comment.text}</span>
            </div>
            {Auth.loggedIn() && Auth.getProfile().data.username === comment.username && (
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleEditCommentClick(comment)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>No comments yet.</ListGroup.Item>
      )}
    </ListGroup>
      {/* show add comment button if the user is logged in and the comment form is not already being shown */}
      {Auth.loggedIn() && !showAddComment && (
        <Button variant='danger' onClick={() => handleAddCommentClick(true)} className='mt-3'>
          Add Comment
        </Button>
      )}
    {/* show the add comment modal if showAddComment is true (user clicked add comment) */}
    {showAddComment && (
        <RecipeComment
          recipeId={recipeId}
          refetchComments={refetch}
          onClose={handleCloseCommentAdded}
          editingComment={editingComment} // pass the editing comment to the RecipeComment component
        />
      )}
    </div>

  );

};
export default RecipeComments;