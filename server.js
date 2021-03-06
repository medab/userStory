var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require("./config");
var mongoose = require("mongoose");
var app = express();
var http= require("http").Server(app);
var io= require("socket.io")(http);
var router = express.Router();
var apiRouter = require("./app/routes/api")(app,router,io);



mongoose.connect(config.database, function(err) {

	if(err){
		console.log(err);
	}else{
		console.log('Connected to database');
	}
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

//var api = require('./app/routes/api')(app,express);

app.use('/myapp',apiRouter);

app.get('*', function(req, res) {

	res.sendFile(__dirname + ('/public/app/views/index.html'));
})


http.listen(config.port,function(err) {

	if(err){
		console.log(err);
	}else{
		console.log("listening on port "+ config.port);
	}
	
});