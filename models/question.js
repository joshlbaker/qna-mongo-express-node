// models/question.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    Answer = require('./answer');

var QuestionSchema = new Schema({
  text: String,
  // answers embedded
  answers: [Answer.schema]
});

// If answers were referenced 
// answers: [{
// 	type: Schema.Types.ObjectId,
// 	ref: 'Answer'
// }]

var Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;


