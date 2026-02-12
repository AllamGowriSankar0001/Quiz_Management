const express = require("express");
const router = express.Router();
const {StartAttempt,SubmitQuiz,GetQuizName,GetResult,GetAllUsers} = require("../Controllers/userControllers");

router.post("/startquiz",StartAttempt);
router.post("/submitquiz",SubmitQuiz);
router.get("/quizname/:sessionCode",GetQuizName);
router.post("/getresult",GetResult);
router.get("/getallusers",GetAllUsers);
module.exports = router