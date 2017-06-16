var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var Place = new Schema({
  	place: String,
  	count: Number
});


module.exports = mongoose.model('places', Place);