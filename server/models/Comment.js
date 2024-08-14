const { Schema, model } = require('mongoose');
//models stores all comments created with data to link them to a username and a recipe id
const commentSchema = new Schema({

    text: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    recipeId: {
        type: Number,
        require: true,
    }

});


const Comment = model('Comment', commentSchema);

module.exports = Comment;