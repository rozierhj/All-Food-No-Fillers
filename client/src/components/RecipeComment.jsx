import {useState, useEffect} from 'react';
import {Form, Button} from 'react-bootstrap';
import {useMutation, useLazyQuery} from '@apollo/client';
import {ADD_COMMENT} from '../utils/mutations';
import { GET_RECIPE_COMMENTS, GET_ME } from '../utils/queries';
import Auth from '../utils/auth';

const RecipeComment = ({recipeId}) => {
    const [commentText, setCommentText] = useState('');
    const [username, setUsername] = useState('');
    const [getMe, {data:meData}] = useLazyQuery(GET_ME);
    const [addComment, {error}] = useMutation(ADD_COMMENT, {
        refetchQueries: [{query: GET_RECIPE_COMMENTS,
            variables: {recipeId}
        }],
    });

    useEffect(()=>{
        if(Auth.loggedIn()){
            getMe();
        }
    }, [getMe]);

    useEffect(()=>{
        if(meData){
            setUsername(meData.me.username);
        }
    }, [meData]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

    try{
        console.log(recipeId, username, commentText)
        await addComment({
            
            variables:{
                recipeId: recipeId,
                username: username,
                text: commentText,
            }
        });
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

