// server.js

// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),  // for data from the request body
    mongoose = require('mongoose');       // to interact with our db
    Question = require('./models/question');
    Answer = require('./models/answer');

// connect to mongodb
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/qna'
);

// configure body-parser
app.use(bodyParser.urlencoded({extended: true}));


// routes

// get all questions
app.get('/api/questions', function(req,res){
	Question.find({}, function(err, questions){
		res.json(questions);
	});
});

// get one specific question
app.get('/api/questions/:id', function (req, res){

	var targetId = req.params.id;

	Question.findOne({_id: targetId}, function(err, foundQuestion){
		res.json(foundQuestion);
	});
});


// create new question
app.post('/api/questions', function (req, res) {
  // create new question with data from the body of the request (`req.body`)
  // body should contain the question text itself
  var newQuestion = new Question({
    text: req.body.text
	  });

  // save new question
  newQuestion.save(function (err, savedQuestion) {
    res.json(savedQuestion);
  });
});	

// update question, but only the part(s) passed in in the request body
// not currently that exciting when question has only one attribute
app.put('/api/questions/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find question in db by id
  Question.findOne({_id: targetId}, function (err, foundQuestion) {
    // update the question's text, if the new text passed in was truthy
    // otherwise keep the same text
    foundQuestion.text = req.body.text;

    // save updated question in db
    foundQuestion.save(function (err, savedQuestion) {
      res.json(savedQuestion);
    });
  });
});

// obliterates a specific question
app.delete('/api/questions/:id', function (req, res){
	
	var targetId = req.params.id;

	Question.findOneAndRemove({_id: targetId}, function(err, deletedQuestion){
		res.json(deletedQuestion);

	});
});
app.post('/api/questions/:questionId/answers', function(req, res){
	// create new answer (from form params)
	var newAnswer = new Answer(req.body.answer);
	// instead of saving the answer by itself, we save it embedded inside of the question
	// newAnswer.save();

	// find question by url params
	var questionId = req.params.questionId;
	Question.findOne({_id: questionId}, function(err, foundQuestion){
		// push new answer into question.answers
		foundQuestion.answers.push(newAnswer);
		foundQuestion.save(function (err, savedQuestion){
			// respond with new answer
			res.json(newAnswer);
		});
	});
});


// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('server started on localhost:3000');
});