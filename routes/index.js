var express = require('express');
var router = express.Router();
var yelp = require('yelp-fusion');
var User = require('../models/user.js');
var Place = require('../models/places.js');

var clientId = '5vg4arEfVEd-6ZHKgZa1oQ';
var clientSecret = 'UNj216lADVN32XhsPkArizKZfvzhDtaaYSNLonHDJcFLMxXCICTKRKHSMYED5Nje';

/* GET home page. */
router.get('/', function(req, res, next) {
	var sess = req.session;
	var data = sess.data;
	var user = sess.user;
	Place.find({},function(err,places){
		if(err){
			console.log(err)
		} else {
			var place = places;
			console.log(place);
			if(sess.user){
				res.render('index', { data, user, place });
			} else {
				res.render('login');
			}
		}
	});
});

router.post('/login',function(req,res){
	var email = req.body.email;
	var password = req.body.password;
	var sess = req.session;
	User.findOne({ email: email },function(err,user){
		if(err){
			console.log(err);
			res.redirect('/');
		} else {
			if( password == user.password ){
				sess.user = user;	
			}
			res.redirect('/');
		};
	});
});

router.get('/signup',function(req,res){
	res.render('signup');
});

router.post('/signup',function(req,res){
	var email = req.body.email;
	var password = req.body.password;
	var fullname = req.body.fullname;

	var newUser = new User();
	newUser.email = email;
	newUser.password = password;
	newUser.fullname = fullname;
	newUser.interestedPlace = [];

	newUser.save(function(err,user){
		if(err){
			console.log("DB insertion error");
		} else {
			res.redirect('/');
		}
	});
	
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

router.post('/going',function(req,res){
	var id = req.body.id;
	Place.findOne( { place: id }, function(err,place){
		 if(err){
		 	console.log(err);
		 } else if(place){
			var newCount = place.count + 1;
			Place.findOneAndUpdate({ place: id }, {$set: { count: newCount }},function(err,updatedPlace){
				console.log(updatedPlace);
				res.redirect('/');
			});
		 } else {
		 	var newPlace = new Place();
		 	newPlace.place = id;
		 	newPlace.count = 1;
		 	newPlace.save(function(err,result){
		 		if(err){
		 			console.log(err);
		 		} else {
		 			console.log(result);
		 			res.redirect('/');
		 		}
		 	})
		 }
	});
});

module.exports = router;
