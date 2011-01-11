var sqlite = require('sqlite')
,	mongoose = require('mongoose').Mongoose
,	mdb = mongoose.connect('mongodb://localhost/safeword')
,	sdb = new sqlite.Database()
,	sqlitedbfile = '/var/db/safeword/safewords.sqlite'
,	Word = require('./models.js').Word(mdb);

sdb.open(sqlitedbfile, function(error) {
	if (error) {
		console.log('error opening db');
		throw error;
	}
	
	sdb.execute("SELECT * FROM words", function(err, rows) {
		if (error) {
			console.log('error doing select');
			throw error;
		}

		rows.forEach(function(row) {
			/*
			{ id: 94
			, createDate: '2010-12-29 09:10:01'
			, word: 'alight'
			, lastused: 1293782406
			, wordoftheday: null
			, addedby: 'lexlimo'
			, usagecount: 1
			}
			
			* */
			console.log(row);
			var wordObj = {
				word: row.word,
				wordoftheday: (function() { return row.wordoftheday ? true : false; })(),
				addedby: row.addedby,
				usagecount: row.usagecount,
				created: makeDateObj(row.createDate),
				lastused: makeDateObj(row.lastused)
			}
			
			,	word = new Word(wordObj);
			word.save();
		});
	});
	
});


var makeDateObj = function(ts) {
	if (!isNaN(ts)) {
		ts = ts*1000;
	}
	var date = new Date(ts)
	,	dow = date.getDay()	
	,	y = date.getFullYear()
	,	m = date.getMonth() + 1
	,	d = date.getDate()
	,	mstr = m < 10 ? "0" + m : m.toString()
	,	dstr = d < 10 ? "0" + d : d.toString();
	
	return {
		date: date,
		timestamp: date.getTime(),
		str: y + '-' + mstr + '-' + dstr,
		year: y,
		month: m,
		day: d,
		dow: dow
	};
};