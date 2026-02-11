const express = require("express");
const router = express.Router();
const {StartAttempt,SubmitQuiz} = require("../Controllers/userControllers");

router.post("/startquiz",StartAttempt);
router.post("/submitquiz",SubmitQuiz);
module.exports = router