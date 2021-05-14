
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    default: 'USER'
  },
  created: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Users', UserSchema);