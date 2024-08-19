import {useState, useEffect} from 'react';
import {Form, Button} from 'react-bootstrap';
import {useMutation, useLazyQuery} from '@apollo/client';
import {ADD_COMMENT, ADD_REACTION, UPDATE_REACTION, EDIT_COMMENT} from '../utils/mutations';
import {GET_ME, GET_RECIPE_REACTION } from '../utils/queries';
import Auth from '../utils/auth';

const RecipeComment = ({recipeId, refetchComments, onClose, editingComment}) => {
    //state managing text of the comment
    const [commentText, setCommentText] = useState(editingComment ? editingComment.text : '');
    //const [commentText, setCommentText] = useState('');
    //state stores the username
    const [username, setUsername] = useState('');
    //fetch user data
    const [getMe, {data:meData}] = useLazyQuery(GET_ME);
    //mutation to add comment and then refresh comments after adding
    const [addComment] = useMutation(ADD_COMMENT);
    const [addReaction] = useMutation(ADD_REACTION);
    const [updateReaction] = useMutation(UPDATE_REACTION);
    const [editComment] = useMutation(EDIT_COMMENT);
    const [error, setError] = useState(null);
    const [getRecipeReaction] = useLazyQuery(GET_RECIPE_REACTION);

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
        
        if(editingComment){
            await editComment({
                variables: {
                  commentId: editingComment._id,
                  newText: commentText,
                },
              });  
        }
        else{
            const {data: reactionData} = await getRecipeReaction({variables:{recipeId}});
            //reactionData.getRecipeReaction.__typename === 'Reaction'
            if(reactionData?.getRecipeReaction?.__typename === 'Reaction'){
                const {data : commentData} = await addComment({
                    variables:{
                        recipeId: recipeId,
                        username: username,
                        text: commentText,
                    },
                });
                const commentId = await commentData.addComment._id;
    
                await updateReaction({
                    variables:{
                        reactionId:reactionData.getRecipeReaction._id,
                        commentId: commentId,
                    }
                });
            }
            else{
                
                    const {data:reactionCreationData} = await addReaction({
                    
                        variables:{
                            recipeId:recipeId
                        }
                    });
    
    
                
                const {data : commentData} = await addComment({
                    variables:{
                        recipeId: recipeId,
                        username: username,
                        text: commentText,
                    },
                });
              
                const commentId = await commentData.addComment._id;
    
                const newReactionId = await reactionCreationData.addReaction._id;
               
                await updateReaction({
                    variables:{
                        reactionId:newReactionId,
                        commentId: commentId,
                    }
                });
                
            }
        }
        //mutation for adding a comment is executed
        
        setCommentText('');
        await onClose();
        await refetchComments();
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
        {editingComment ? 'Save Changes' : 'Save Comment'}
      </Button>
  </Form>
);
}

export default RecipeComment;

