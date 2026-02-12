const Attempt = require("../Models/AttendQuiz");
const Quiz = require("../Models/quizModel");
const Questions = require("../Models/questionModel");
const User = require("../Models/userModel");

const StartAttempt = async (req, res) => {
  try {
    const { name, email, sessionCode } = req.body;

    if (!name || !email || !sessionCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const quiz = await Quiz.findOne({ sessionCode, isActive: true });
    if (!quiz) {
      return res.status(404).json({ message: "Invalid session code" });
    }

    const existingAttempt = await Attempt.findOne({ sessionCode, email });
    if (existingAttempt && existingAttempt.status === "SUBMITTED") {
      return res.status(403).json({
        message: "You already attended this quiz",
      });
    }

    let attempt;
    if (existingAttempt && existingAttempt.status === "IN_PROGRESS") {
      attempt = existingAttempt;
    } 
    else {
      attempt = await Attempt.create({
        sessionCode,
        name,
        email,
        status: "IN_PROGRESS",
      });
    }

    const questions = await Questions.find({ sessionCode }).select(
      "-options.isCorrect"
    );

    return res.status(200).json({
      quizName: quiz.quizName,
      sessionCode,
      attemptId: attempt._id,
      questions,
    });

  } catch (err) {
    return res.status(500).json({
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

const GetResult = async(req,res)=>{
  try{
    const { sessionCode, email } = req.body;
    if (!sessionCode || !email) {
      return res.status(400).json({ message: "sessionCode and email are required" });
    }
    const attempt = await Attempt.findOne({ sessionCode, email });
    if (!attempt) {
      return res.status(404).json({ message: "No attempt found" });
    }
    const questions = await Questions.find({ sessionCode });

    res.status(200).json({
      score: attempt.score,
      totalQuestions: questions.length
    });
    
  }
  catch(err){
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
}

const GetQuizName = async(req,res)=>{
  try{
      const { sessionCode } = req.params;
    if (!sessionCode) {
      return res.status(400).json({ message: "sessionCode is required" });
    }
    const quiz = await Quiz.findOne({ sessionCode });
    res.status(200).json({ quizName: quiz.quizName });
      }
    catch(err){
      res.status(500).json({ message: "Error occurred", error: err.message });
    }
  }

const GetAllUsers = async(req,res)=>{
  try{
    const users = await Attempt.distinct("email");
    res.status(200).json({ UserData: users });
  }
  catch(err){
    res.status(500).json({ message: "Error occurred", error: err.message });
    }
  }
module.exports = { StartAttempt , SubmitQuiz , GetQuizName , GetResult , GetAllUsers };
