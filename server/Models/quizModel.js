const { default: mongoose } = require("mongoose");

const quizSchema = new mongoose.Schema({
  sessionCode: {
    type: String,
    required: true,
    unique: true 
  },
  quizName: {
    type: String,
    required: true
  },
  numberOfQuestions: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });
module.exports = mongoose.model("Quiz",quizSchema)