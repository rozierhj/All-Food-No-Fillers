const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');
const {ObjectId} = Schema.Types;
const Comment = require('./Comment');
const Recipe = require('./Recipe');

const foodieSchema = new Schema({
    username: {
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
        type: ObjectId,
         ref: 'Recipe',
        },
      ],
      comments:[
        {
            type: ObjectId,
            ref: 'Comment',
        }
      ]
});

// set up pre-save middleware to create password
foodieSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
foodieSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Foodie = model('Foodie',foodieSchema);
module.exports = Foodie;