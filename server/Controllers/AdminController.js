const jwt = require("jsonwebtoken");
const adminSchema = require("../Models/AdminModel");
const quizModel = require("../Models/quizModel");
const questionModel = require("../Models/questionModel");
const bcrypt = require("bcrypt");

const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required !" });
    }
    const admin = await adminSchema.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "No email found" });
    }
    const ismatch = await bcrypt.compare(password, admin.password);
    if (!ismatch) {
      return res.json({ message: "Invalid Credentials" });
    } else {
      const token = jwt.sign(
        { email: admin.email, role: admin.role },
        process.env.JWTSECRETKEY,
        { expiresIn: "1d" },
      );
      res.status(202).json({ message: "Admin Logged-In", YOUR_TOKEN: token });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error Occurred, Please Try again",
      Error: error.message,
    });
  }
};

const QuizCreate = async (req, res) => {
  try {
    const { sessionCode, quizName, numberOfQuestions, questionsList } =
      req.body;

    if (!sessionCode || !quizName) {
      return res
        .status(400)
        .json({ message: "Session code and quiz name are required" });
    }

    const totalQuestions =
      (Array.isArray(questionsList) && questionsList.length) ||
      Number(numberOfQuestions) ||
      0;

    if (!totalQuestions) {
      return res
        .status(400)
        .json({ message: "At least one question is required" });
    }

    const quiz = await quizModel.create({
      sessionCode,
      quizName,
      numberOfQuestions: totalQuestions,
    });

    if (!quiz) {
      return res.status(400).json({ message: "Unable to create the Quiz" });
    }

    const questionsPayload = questionsList.map((q) => ({
      sessionCode,
      questionText: q.questionText,
      options: q.options,
    }));

    const createdQuestions = await questionModel.insertMany(questionsPayload);

    return res.status(200).json({
      message: "Quiz and questions created",
      QuizData: quiz,
      QuestionsData: createdQuestions,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error Occurred, Please Try again",
      Error: err.message,
    });
  }
};

const QuestionsCreate = async (req, res) => {
  try {
    const { sessionCode, questionsList } = req.body;
    if (!sessionCode || !questionsList) {
      return res.status(400).json({ message: "All fields are required !" });
    }
    const session = await quizModel.findOne({ sessionCode });
    if (!session) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const newQuestions = questionsList.map((q) => ({
      sessionCode,
      questionText: q.questionText,
      options: q.options,
    }));
    const addquestion = await questionModel.insertMany(newQuestions);
    if (!addquestion) {
      return res.status(400).json({ message: "Unable to add questions" });
    }
    const allQuestions = await questionModel.find({ sessionCode });
    res.status(201).json({
      message: "Questions added successfully",
      quizData: allQuestions,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error Occurred, Please Try again",
      Error: err.message,
    });
  }
};

const GetAllQuizzes = async (req, res) => {
  try {
    const quizzes = await quizModel.find();
    res.status(200).json({ QuizData: quizzes });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const GetAllActiveSessions = async (req, res) => {
  try {
    const activeSessions = await quizModel.find({ isActive: true });
    res.status(200).json({ ActiveSessions: activeSessions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const DeleteQuizSession = async (req, res) => {
  try {
    const { sessionCode } = req.params;

    if (!sessionCode) {
      return res.status(400).json({ message: "Session code is required" });
    }

    const deletedQuiz = await quizModel.findOneAndDelete({ sessionCode });

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz session not found" });
    }

    const questionsResult = await questionModel.deleteMany({ sessionCode });

    return res.status(200).json({
      message: "Quiz session deleted successfully",
      deletedQuiz,
      deletedQuestionsCount: questionsResult.deletedCount,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error Occurred, Please Try again",
      Error: err.message,
    });
  }
};

const EditQuizSession = async (req, res) => {
  try {
    const { sessionCode } = req.params;
    const { isActive, questionsList, quizName } = req.body;
    if (!sessionCode || !questionsList) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const quiz = await quizModel.findOne({ sessionCode });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    quiz.quizName = quizName || quiz.quizName;
    quiz.isActive = isActive || quiz.isActive;
    for (const q of questionsList) {
      if (q._id) {
        await questionModel.findByIdAndUpdate(q._id, {
          questionText: q.questionText,
          options: q.options,
        });
      } else {
        await questionModel.create({
          sessionCode,
          questionText: q.questionText,
          options: q.options,
        });
      }
    }
    const totalQuestions = await questionModel.countDocuments({ sessionCode });
    quiz.numberOfQuestions = totalQuestions;
    await quiz.save();
    const updatedQuestions = await questionModel.find({ sessionCode });

    res.status(200).json({
      message: "Quiz updated successfully",
      quiz,
      questions: updatedQuestions,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error Occurred, Please Try again",
      Error: err.message,
    });
  }
};
const DeleteQuestionForSession = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!questionId) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    const question = await questionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await questionModel.findByIdAndDelete(questionId);
    const totalQuestions = await questionModel.countDocuments({
      sessionCode: question.sessionCode,
    });

    await quizModel.findOneAndUpdate(
      { sessionCode: question.sessionCode },
      { numberOfQuestions: totalQuestions },
    );

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: "Error Occurred, Please Try again",
      Error: err.message,
    });
  }
};
const EndSession = async (req, res) => {
  try {
    const { sessionCode } = req.body;

    const session = await quizModel.findOne({ sessionCode });

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    session.isActive = false; 
    await session.save(); 

    res.status(200).json({
      message: "Session ended successfully",
      session,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error occurred, please try again",
      error: err.message,
    });
  }
};
const viewAllQuestions = async (req, res) => {
  try {
    const { sessionCode } = req.query; 
    const allquestions = await questionModel.find({ sessionCode: sessionCode });
    if (!allquestions) {
      return res.status(404).json({
        message: "question in Session  not found",
      });
    }
    res.status(200).json({
      message: "Session questions fetched successfully",
      allquestions,
    });

  } catch (err) {
    res.status(400).json({
      message: "Error occurred, please try again",
      error: err.message,
    });
  }
};

const VerifyTokenController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized", valid: false });
    }
    res.status(200).json({ 
      message: "Token is valid", 
      valid: true,
      user: {
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(401).json({ 
      message: "Token verification failed", 
      valid: false,
      error: error.message 
    });
  }
};

module.exports = {
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
  VerifyTokenController,
};
