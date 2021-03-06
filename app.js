var express = require('express')
,   app = module.exports = express.createServer()
,	mongoose = require('mongoose').Mongoose
,	db = mongoose.connect('mongodb://localhost/safeword')
,	sys = require('sys')
,	Word;


////////////////////////////////////////////////////////////////
// Configuration ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////
app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStackTrace: true })); 
});

app.configure('production', function(){
});

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.bodyDecoder());
	app.use(express.cookieDecoder());
	app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.staticProvider(__dirname + '/public'));
});



app.Word = Word = require('./models.js').Word(db);

////////////////////////////////////////////////////////////////
// Routes //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
app.get('/', function(req, res){
	// res.render('index', {
	// 		locals: {
	// 			title: "The Safeword"
	// 		}});
	res.redirect('/words');
});

// Get all words
app.get('/words.:format?', function(req, res) {

	switch(req.params.format) {
		case 'json': 
			Word.find().all(function(words) {
				res.send(words.map(function(w) {
					return w.__doc;
				}));
			});
			break;
			
		default:
			Word.find().sort([['wordoftheday', 'descending']]).all(function(words) {
				res.render('words/index', {
					locals: { words: words, wtf: 'what the frack' }
				});
			});
			
	}

});

// Create new word
app.get('/words/new', function(req, res) {
	res.render('words/new.jade');
});
app.post('/words.:format?', function(req, res) {	
	var wordObj = JSON.parse(req.body.word)
    ,   now = new Date()
    ,   year = now.getFullYear()
    ,   month = now.getMonth()
    ,   monthStr = month.toString().length === 1 ? '0' + month.toString() : month.toString()
    ,   day = now.getDate()
    ,   dayStr = day.toString().length === 1 ? '0' + day.toString() : day.toString()
    ,   dayofweek = now.getDay()
    ,   newword;
	
	wordObj.created = {
        date: new Date(),
        timestamp: now.getTime(),
        str: year.toString() + '-' + monthStr + '-' + dayStr,
        year: year,
        month: month,
        day: day,
        dayofweek: dayofweek
    };
	wordObj.lastused = {
        date: null,
        timestamp: 0,
        str: null,
        year: null,
        month: null,
        day: null,
        dayofweek: null
    };
    wordObj.wordoftheday = false;
	wordObj.usagecount = 0;
	
    newword = new Word(wordObj);

	Word.find({word:wordObj.word}).one(function(existingword) {
		if (existingword) {
			switch(req.params.format) {
				case 'json':
					res.send({
						"req": req.url,
						"method": req.method,
						"body": req.rawBody,
						"error": "Word '" + wordObj.word + "' already exists",
						"errorcode": "duplicateword"
					});
					break;
					
				default:
					res.render('');
			}
		} else {
			newword.save(function() {
		        switch(req.params.format) {
		            case 'json': 
		                res.send(newword.__doc);
		                break;

		            default:
		                res.render('');
		        }
		    });
		}
	});
});

// Get specific word
app.get('/words/:word.:format?', function(req, res, next) {
	Word.find({word:req.params.word}).one(function(word) {
		// TODO implement 404 handling
		if (!word) {
			return next(new NotFound('Word not found'));
		}
		switch(req.params.format) {
			case 'json': 
				res.send(word.__doc);
				break;
				
			default:
				res.render('words/word', {
					locals: { word: word }
				});
		}
	});
});

// Delete word
app.del('/words/:word.:format?', function(req, res) {
	Word.find({word:req.params.word}).one(function(word) {
		
		// TODO implement 404 handling
		if (!word) {return next(new NotFound('Word not found'));}
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


////////////////////////////////////////////////////////////////
// Error Handling //////////////////////////////////////////////
////////////////////////////////////////////////////////////////
function NotFound(msg) {
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}

sys.inherits(NotFound, Error);

app.get('/404', function(req, res) {
	throw new NotFound;
});

app.get('/500', function(req, res) {
	throw new Error('An expected error');
});

app.get('/bad', function(req, res) {
	unknownMethod();
});

app.error(function(err, req, res, next) {
	if (err instanceof NotFound) {
		res.render('404.jade', { status: 404 });
	} else {
		next(err);
	}
});

app.error(function(err, req, res) {
	res.render('500.jade', {
		status: 500,
		locals: {
			error: err
		} 
	});
});



// Only listen on $ node app.js

if (!module.parent) {
	app.listen(3000);
	console.log("Express server listening on port %d, environment: %s", app.address().port, app.settings.env);
}
