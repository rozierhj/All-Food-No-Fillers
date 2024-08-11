const { Schema, model } = require('mongoose');

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


const Foodie = model('Foodie', foodieSchema);

module.exports = Foodie;