var mongoose = require('mongoose').Mongoose;
mongoose.model('Word', {
	collection: 'words',
	properties: [
		'word',
		'addedby', 
		{
			'created': [
				'date',
				'timestamp', 
				'str', 
				'year',
				'month',
				'day',
				'dow'
			]
		},
		{
			'lastused': [
				'date',
				'timestamp', 
				'str', 
				'year',
				'month',
				'day',
				'dow'
			]
		},
		'usagecount',
		'wordoftheday'
	],
	indexes: [
		[{word: 1}, {unique:true}],
		'wordoftheday',
		'addedby',
		'lastused.timestamp'
	]
});

exports.Word = function(db) {
	return db.model('Word');
};

