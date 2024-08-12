const {Schema, model} = require('mongoose');
//model to hold data for any upvotes or comments done on a recipe

const reactionSchema = new Schema({

    recipeId: {
        type: Number,
        required: true
    },
    upVotes: {
        type: Number
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]

});

const Reaction = model('Reactions', reactionSchema);

module.exports = Reaction;