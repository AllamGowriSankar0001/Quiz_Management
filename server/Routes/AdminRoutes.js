const express = require('express');
const router = express.Router();
const VerifyToken = require("../Middleware/verifyToken");
const {
  AdminLogin,
  QuizCreate,
  QuestionsCreate,
  GetAllQuizzes,
  GetAllActiveSessions,
  DeleteQuizSession,
  EditQuizSession,
  DeleteQuestionForSession,
  EndSession,
  viewAllQuestions,
  VerifyTokenController
} = require("../Controllers/AdminController");

router.post("/login", AdminLogin);
router.get("/verify", VerifyToken, VerifyTokenController);
router.post("/createquiz", VerifyToken, QuizCreate);
router.post("/addquestions", VerifyToken, QuestionsCreate);
router.get("/quizzes", GetAllQuizzes);
router.delete("/quizzes/:sessionCode", VerifyToken, DeleteQuizSession);
router.get("/active", GetAllActiveSessions)
router.put("/editquiz/:sessionCode",VerifyToken, EditQuizSession);
router.delete("/deletequestionforsession",VerifyToken, DeleteQuestionForSession);
router.put("/end",VerifyToken, EndSession);
router.get("/allquestionofsession",viewAllQuestions)

module.exports = router