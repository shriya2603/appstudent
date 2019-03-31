const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const quizSchema = new Schema({
    question:{type:String},
    option1:{
      option1:{type:String},
      point:{type:Number}
    },
    option2:{
      option2:{type:String},
      point:{type:Number}
    },
    option3:{
      option3:{type:String},
      point:{type:Number}
    },
    option4:{
      option4:{type:String},
      point:{type:Number}
    },
    rightAnswer:{type:String},
    imageName:{type:String},
    yogaSutra:{type:String},
    thematic:{type:String,required: true},
    createdAt:{
      type: Date, 
      default: Date.now()
    }

});

// Create a model
const Quiz = mongoose.model('quiz', quizSchema);

// Export the model
module.exports = Quiz;