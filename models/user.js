var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
  fullname: String,
  email: String,
  password: String,
  interestedPlace: Array
});


module.exports = mongoose.model('users', User);