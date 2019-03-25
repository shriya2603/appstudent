const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const quizSchema = new Schema({
    question:{type:String},
    answer:{type:String},
    imageName:{type:String},
    thematic:{type:String},
    createdAt:{type: Date, 
		default: Date.now()}

});

// Create a model
const Quiz = mongoose.model('quiz', quizSchema);

// Export the model
module.exports = Quiz;