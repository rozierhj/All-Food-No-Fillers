const {Schema, model} = require('mongoose');

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