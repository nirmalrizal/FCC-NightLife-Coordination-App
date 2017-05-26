var express = require('express');
var router = express.Router();
var yelp = require('yelp-fusion');

var clientId = '5vg4arEfVEd-6ZHKgZa1oQ';
var clientSecret = 'UNj216lADVN32XhsPkArizKZfvzhDtaaYSNLonHDJcFLMxXCICTKRKHSMYED5Nje';

/* GET home page. */
router.get('/', function(req, res, next) {
	var sess = req.session;
	var data = sess.data;
	//console.log("Data := " + data);
	res.render('index', { data });
});

router.post('/search',function(req, res){
	var sess = req.session;
	var loc = req.body.location;
	var searchRequest = {
					  term:'bars',
					  location: loc
					};
	//console.log(searchRequest);
	yelp.accessToken(clientId, clientSecret)
		.then(function(data1){
			var client = yelp.client(data1.jsonBody.access_token);

			client.search(searchRequest).then(function(data2){
			    sess.data = data2.jsonBody.businesses;
			    console.log(JSON.stringify(data2.jsonBody.businesses[0], null, 4));
			    res.redirect('/');
			});
		})
		.catch(function(err){
			  console.log(err);
		});
});

module.exports = router;
