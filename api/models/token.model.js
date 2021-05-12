
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TokenSchema = new Schema({
    email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expire: 3600,
  }
});


module.exports = mongoose.model('Token', TokenSchema);