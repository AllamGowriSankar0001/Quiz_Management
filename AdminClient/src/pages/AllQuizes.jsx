import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { verifyToken, clearAuthData } from "../utils/tokenVerification";

const AllQuizzes = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedquizName, setSelectedquizName] = useState(null);
  const endSession = async (sessionCode) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/admin/end`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionCode: sessionCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to end session");
      }
      fetchQuizzes();
      console.log("Session ended:", data);
    } catch (err) {
      setError(err.message || "Failed to end session");
    }
  };
  const viewQuestions = async (sessionCode, quizName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/admin/allquestionofsession?sessionCode=${sessionCode}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSelectedQuestions(data.allquestions || []);
      setSelectedSession(sessionCode);
      setSelectedquizName(quizName);
      setShowQuestions(true);
      console.log(data.allquestions);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        clearAuthData();
        navigate("/", { replace: true });
        return;
      }

      const result = await verifyToken();
      if (!result.isValid) {
        clearAuthData();
        navigate("/", { replace: true });
        return;
      }

      await fetchQuizzes();
    };

    initialize();
  }, [navigate]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/quizzes`);
      const data = await res.json();
      console.log(data);

      setQuizzes(data.QuizData || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load quizzes");
      setLoading(false);
    }
  };
  const handleEdit = async (quiz) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/editquiz/${quiz.sessionCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quizName: quiz.quizName,
            isActive: quiz.isActive,
            questionsList: selectedQuestions,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update quiz");
      }

      alert("Quiz updated successfully");
      fetchQuizzes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (sessionCode, id) => {
    const confirmDelete = window.confirm(
      `Delete quiz with session code "${sessionCode}"? This will remove all its questions too.`,
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    setError("");

    const Token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/admin/quizzes/${sessionCode}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete quiz");
      }

      setQuizzes((prev) =>
        prev.filter((quiz) => quiz.sessionCode !== sessionCode),
      );
    } catch (err) {
      setError(err.message || "Failed to delete quiz");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <h2 className="status-text">Loading quizzes...</h2>;
  if (error) return <h2 className="status-text error">{error}</h2>;
const handleShare = (sessionCode) => {
  const USER_FRONTEND_URL = import.meta.env.VITE_USER_FRONTEND_URL;
  const shareLink = `${USER_FRONTEND_URL}/quiz/${sessionCode}`;
  navigator.clipboard.writeText(shareLink);
  alert("Link copied!");
};

  return (
    <div className="all-quizzes">
      <div className="all-quizzes__header">
        <h1>All Quizzes</h1>
        <p>Overview of all available quiz sessions and their details.</p>
        
      </div>

      <div className="all-quizzes__content">
        {quizzes.length === 0 ? (
          <p className="no-quizzes">No quizzes found</p>
        ) : (
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div className="quiz-card" key={quiz._id}>
                <div style={{display:"flex",width:"100%",justifyContent:"space-between"}}>

                <h3 className="quiz-title">{quiz.quizName}</h3>
                <button
                  onClick={() => handleShare(quiz.sessionCode)}
                  style={{padding:"0px 20px"}}
                >
                  <i className="fa-solid fa-arrow-up-from-bracket"></i>
                </button>
                </div>
                <div className="quiz-info">
                  <p>
                    <span>Session Code:</span> {quiz.sessionCode}
                  </p>
                  <p>
                    <span>No. of Questions:</span> {quiz.numberOfQuestions}
                  </p>
                </div>
                <button
                  className="quiz-delete-button"
                  onClick={() => handleDelete(quiz.sessionCode, quiz._id)}
                  disabled={deletingId === quiz._id}
                >
                  <i className="fa-regular fa-trash-can"></i>{" "}
                  {deletingId === quiz._id ? "Deleting..." : "Delete"}
                </button>
                <button
                  className="quiz-view-btn"
                  onClick={() => viewQuestions(quiz.sessionCode, quiz.quizName)}
                >
                  <i className="fa-regular fa-eye"></i> View
                </button>
                <button
                  className="quiz-edit-btn"
                  onClick={() => handleEdit(quiz)}
                >
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
                {quiz.isActive && (
                  <button
                    className="quiz-delete-button"
                    onClick={() => endSession(quiz.sessionCode)}
                  >
                    <i className="fa-regular fa-circle-xmark"></i> End
                  </button>
                  
                )}
                
              </div>
            ))}
          </div>
        )}
      </div>
      {showQuestions && (
        <div className="float">
          <div className="modal-box">
            <div className="float-header">
              <div className="headings">
                <span>
                  <h1>{selectedquizName}</h1>
                  <p>({selectedSession})</p>
                </span>
              </div>
              <button onClick={() => setShowQuestions(false)}>✕</button>
            </div>

            <div className="allquestions">
              {selectedQuestions.length > 0 ? (
                selectedQuestions.map((question) => (
                  <div key={question._id} className="question-card">
                    <h3>{question.questionText} ?</h3>

                    <ul>
                      {question.options.map((option) => (
                        <li
                          key={option._id}
                          className={
                            option.isCorrect ? "option correct" : "option"
                          }
                        >
                          {option.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No questions found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllQuizzes;
