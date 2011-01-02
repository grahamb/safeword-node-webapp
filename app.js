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

// Get all words
app.get('/words.:format', function(req, res) {
	Word.find().all(function(words) {
		switch(req.params.format) {
			case 'json': 
				res.send(words.map(function(w) {
					return w.__doc;
				}));
				break;
				
			default:
				res.render('');
		}
	});
});

// Get specific word
app.get('/words/:word.:format?', function(req, res) {
	Word.find({word:req.params.word}).one(function(word) {
		// TODO implement 404 handling
		if (!word) {return next(new NotFound('Document not found'));}
		switch(req.params.format) {
			case 'json': 
				res.send(word.__doc);
				break;
				
			default:
				res.render('');
		}
	});
});

// Create new word
app.post('/words/:word.:format?', function(req, res) {
	
});

// Update existing word
app.put('/words/:word.:format?', function(req, res) {
	
});

// Delete word
app.del('/words/:word.:format?', function(req, res) {
	Word.find({word:req.params.word}).one(function(word) {
		
		// TODO implement 404 handling
		if (!word) {return next(new NotFound('Document not found'));}
		// 
		word.remove(function() {
			switch(req.params.format) {
				case 'json':
					res.send({status:'ok'});
					break;
				
				default:
					res.redirect('/words');
			}
		});
	});
});









// Only listen on $ node app.js

if (!module.parent) {
	app.listen(3000);
	console.log("Express server listening on port %d", app.address().port);
}
