'use strict';

var express = require('express');
var router = express.Router();
var yelp = require('yelp-fusion');

var clientId = '5vg4arEfVEd-6ZHKgZa1oQ';
var clientSecret = 'UNj216lADVN32XhsPkArizKZfvzhDtaaYSNLonHDJcFLMxXCICTKRKHSMYED5Nje';
var searchRequest = {
					  term:'bars',
					  location: 'london'
					};

/* GET home page. */
router.get('/', function(req, res, next) {
	yelp.accessToken(clientId, clientSecret).then(function(res){
		var client = yelp.client(res.jsonBody.access_token);

		client.search(searchRequest).then(function(res){
		    var firstResult = res.jsonBody.businesses[1];
		    var prettyJson = JSON.stringify(firstResult, null, 4);
		    console.log(res.jsonBody.businesses.length); //this is actual data
		  });
		}).catch(function(err){
		  console.log(err);
	});
});

module.exports = router;
