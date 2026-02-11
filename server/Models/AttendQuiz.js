const mongoose = require("mongoose")
const attemptSchema = new mongoose.Schema({
  sessionCode: {
    type: String,
    required: true
  },
  name:{
    type:String,
    require:true
  } ,
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["IN_PROGRESS", "SUBMITTED"],
    default: "IN_PROGRESS"
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Questions"
      },
      selectedOption: String
    }
  ],
  score: Number
}, { timestamps: true });

attemptSchema.index({ sessionCode: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Attempt", attemptSchema);
