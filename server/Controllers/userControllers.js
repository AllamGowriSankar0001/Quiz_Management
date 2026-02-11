const Attempt = require("../Models/AttendQuiz");
const Quiz = require("../Models/quizModel");
const Questions = require("../Models/questionModel");

const StartAttempt = async (req, res) => {
  try {
    const { name, email, sessionCode } = req.body;
    if (!name || !email || !sessionCode) {
      return res.status(401).json({ message: "All Fields are required" });
    }
    const quiz = await Quiz.findOne({ sessionCode, isActive: true });
    if (!quiz) {
      return res.status(404).json({ message: "Invalid session code" });
    }
    const existingAttempt = await Attempt.findOne({ sessionCode, email });
    if (existingAttempt) {
      return res.status(403).json({
        message: "You already attended this quiz",
      });
    }
    const attempt = await Attempt.create({
      sessionCode,
      name,
      email,
    });
    const questions = await Questions.find({ sessionCode }).select(
      "-options.isCorrect",
    );
    res.status(200).json({
      quizName: quiz.quizName,
      sessionCode: sessionCode,
      attemptId: attempt._id,
      questions: questions,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error occurred",
      error: err.message,
    });
  }
};

const SubmitQuiz = async(req,res)=>{
  try{
    const { sessionCode, email, answers } = req.body;
    if (!sessionCode || !email || !answers) {
      return res.status(400).json({
        message: "sessionCode, email and answers are required"
      });
    }
    const quiz = await Quiz.findOne({ sessionCode, isActive: true });
    if (!quiz) {
      return res.status(404).json({ message: "Invalid session code" });
    }
     const attempt = await Attempt.findOne({
      sessionCode,
      email,
      status: "IN_PROGRESS"
    });

    if (!attempt) {
      return res.status(404).json({
        message: "No active attempt found"
      });
    }
    let score = 0;
    for (const ans of answers) {
      const question = await Questions.findById(ans.questionId);
      if (question && question.options.some(op => op.isCorrect && op.text === ans.selectedOption)) {
        score++;
      }
    }

    attempt.answers = answers;
    attempt.status = "SUBMITTED";
    attempt.score = score;
    await attempt.save();

    res.status(200).json({
      message: "Quiz submitted successfully",
      answers:attempt.answers
    });

  }
  catch(err){
    res.status(500).json({
      message: "Error occurred",
      error: err.message,
    });
  }
}

module.exports = { StartAttempt , SubmitQuiz };
