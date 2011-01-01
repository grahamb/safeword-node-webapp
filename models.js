var mongoose = require('mongoose').Mongoose;
mongoose.model('Word', {
	collection: 'words',
	types: {
		_id: Object,
		word: String,
		wordoftheday: Boolean,
		addedby: String,
		created: {
			timestamp: Number,
			str: String,
			year: Number,
			month: Number,
			day: Number,
			dayofweek: str
		},
		lastused: {
			timestamp: Number,
			str: String,
			year: Number,
			month: Number,
			day: Number,
			dayofweek: str
		}
	},
	indexes: ['word', 'addedby', 'wordoftheday', 'lastused.timestamp']
});

exports.Word = function(db) {
	return db.model('Word');
};