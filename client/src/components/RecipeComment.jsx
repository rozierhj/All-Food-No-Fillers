import {useState, useEffect} from 'react';
import {Form, Button} from 'react-bootstrap';
import {useMutation, useLazyQuery} from '@apollo/client';
import {ADD_COMMENT, ADD_REACTION, UPDATE_REACTION} from '../utils/mutations';
import { GET_RECIPE_COMMENTS, GET_ME } from '../utils/queries';
import Auth from '../utils/auth';

const RecipeComment = ({recipeId}) => {
    //state managing text of the comment
    const [commentText, setCommentText] = useState('');
    //state stores the username
    const [username, setUsername] = useState('');
    //fetch user data
    const [getMe, {data:meData}] = useLazyQuery(GET_ME);
    //mutation to add comment and then refresh comments after adding
    const [addComment] = useMutation(ADD_COMMENT);
    const [addReaction] = useMutation(ADD_REACTION);
    const [updateReaction] = useMutation(UPDATE_REACTION);
    const [error, setError] = useState(null);

    //get user data
    useEffect(()=>{
        if(Auth.loggedIn()){
            getMe();
        }
    }, [getMe]);

    //update username state once we've got the user data
    useEffect(()=>{
        if(meData){
            //username state set with current users username
            setUsername(meData.me.username);
        }
    }, [meData]);

    //function for adding comments
    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        setError(null);

    try{
        console.log(recipeId, username, commentText);
        //mutation for adding a comment is executed
        const {data : commentData} = await addComment({
            variables:{
                recipeId: recipeId,
                username: username,
                text: commentText,
            },
        });

        const commentId = commentData.addComment._id;

        const {data : reactionData} = await addReaction({
            variables: {
                recipeId: recipeId,
                commentId: commentId,
            },
        });

        if(!reactionData.addReaction){
            await updateReaction({
                variables: {
                    reactionId: reactionData._id,
                    commentId: commentId,
                },
            });
        }
        setCommentText('');
    }
    catch(err){
        console.error('could not add comment',err);
    }
}

return (
    <Form onSubmit={handleCommentSubmit} style={{ width: '100%' }}>
    <Form.Group>
      <Form.Control
        as="textarea"
        rows={3}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add your comment here..."
        required
      />
    </Form.Group>
    {error && <p className="text-danger">Error adding comment</p>}
    <Button variant="primary" type="submit" disabled={!commentText.trim()}>
      Save Comment
    </Button>
  </Form>
);
}

export default RecipeComment;

