var express = require('express')
,   app = module.exports = express.createServer()
,	mongoose = require('mongoose').Mongoose
,	db = mongoose.connect('mongodb://localhost/safeword')
,	Word;


// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyDecoder());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.logger());
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.use(express.logger());
	app.use(express.errorHandler()); 
});

app.Word = Word = require('./models.js').Word(db);

// Routes

app.get('/', function(req, res){
	res.render('index', {
		locals: {
			title: 'The Safeword'
		}
	});
});

app.get('/words.:format', function(req, res) {
	
});

app.post('/words.:format?', function(req, res) {
	
});

app.get('/words/:word.:format?', function(req, res) {
	
});

app.put('/words/:word.:format?', function(req, res) {
	
});

app.del('/words/:word.:format?', function(req, res) {
	
});









// Only listen on $ node app.js

if (!module.parent) {
	app.listen(3000);
	console.log("Express server listening on port %d", app.address().port);
}
