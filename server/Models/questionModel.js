const mongoose = require("mongoose")
const questionSchema = new mongoose.Schema({
  sessionCode: {
    type:String,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [
    {
      text: String,
      isCorrect: Boolean
    }
  ],
}, { timestamps: true });
module.exports = mongoose.model("Questions",questionSchema)