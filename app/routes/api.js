var express = require('express');
var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var jwt = require('jsonwebtoken');
var secretKey = config.secretKey;


 function createToken(user){

   var token = jwt.sign({
    	id: user._id,
    	name: user.name,
    	username: user.username
    },secretKey,{ 
    	expiresIn: 1440
    });

   	return token;
}

 module.exports = function (app,router,io) {


   router.post('/signup', function(req,res) {

   		var user = new User({
   			name: req.body.name,
   			username: req.body.username,
   			password: req.body.password
   		});
      var token = createToken(user);
   		user.save(function(err) {  			
  			if(err){
  				res.send(err);
  				return;
  			}
  	     	res.json({ 
            success: true,
            message: 'User has been created',
            token: token
         });
   		});

   });


   router.get('/users', function(req, res) {

      User.find({},function(err, users) {
        if(err){ 
          res.send(err);
          return;
        }
        res.json(users);
      });


   });



    router.post('/login', function(req, res) {


       User.findOne({
       	username: req.body.username

       }).select("username name password").exec(function(err,user) {

       	if (err){
       		res.send(err);
       	}

       	if(!user){
       			res.send({ message: 'user doesn\'t exist'});
       	}else if (user){

       		var validPassword = user.comparePassword(req.body.password);

       			if(!validPassword){
       				res.send({ message: 'Invalid password :'});
       			}else {

       			var token = createToken(user);
       			res.json({
 							  success: true,
 							  message: "Successfuly login",
 							  token: token
       			});
       		}
		}
       	
       });


    });

    router.use(function(req, res, next) {

    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    // check if token exist
    if(token) {

      jwt.verify(token, secretKey, function(err, decoded) {

        if(err) {
          res.status(403).send({ success: false, message: "Failed to authenticate user"});

        } else {
          //
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).send({ success: false, message: "No Token Provided"});
    }

  });
    
    // bypass midlleware

    router.route('/')

    .post(function(req, res) {

    	var story = new Story({
    		creator: req.decoded.id,
    		content: req.body.content
    	});
 		
 		story.save(function(err,newStory) {
 			if(err){
 				res.json({ message: 'Error'});
 				res.send(err);
 				return;
 			}else{
        io.emit('story',newStory);
 				res.json({ message: 'New Story created'});
 			}
 		});
    })

    .get(function(req, res) {

          Story.find({ creator:req.decoded.id}, function(err,stories) {
          	if(err){
          		res.send(err);
          		return;
          	}else{
          		res.json(stories);
          	} 
        });
    });

    router.get('/me', function(req, res) {
    	res.send(req.decoded);
    });

   return router;

 }