const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');
const {ObjectId} = Schema.Types;
const Comment = require('./Comment');

const foodieSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must match an email address!'],
      },
      password: {
        type: String,
        required: true,
      },
      favorites: [
        {
          type: String,
          trim: true,
        },
      ],
      comments:[
        {
            type: ObjectId,
            ref: 'Comment',
        }
      ]
});

const Foodie = model('Foodie',foodieSchema);
module.exports = Foodie;