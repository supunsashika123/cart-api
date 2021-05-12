
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GuserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Gusers', GuserSchema);