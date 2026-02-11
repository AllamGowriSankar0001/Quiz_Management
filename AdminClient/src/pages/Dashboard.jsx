import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken, clearAuthData } from "../utils/tokenVerification";

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const navigate = useNavigate();
  const [activeSessions, setActiveSessions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedquizName, setSelectedquizName] = useState(null);

  const fetchActiveSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin/active`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setActiveSessions(data.ActiveSessions || []);
    } catch (err) {
      setError("Failed to load active sessions");
    }
  };

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
  const viewQuestions = async (sessionCode,quizName) => {
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
      setSelectedquizName(quizName)
      setShowQuestions(true);
      console.log(data.allquestions);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin/quizzes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setQuizzes(data.QuizData || []);
    } catch (err) {
      setError("Failed to load quizzes");
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

      await Promise.all([fetchActiveSessions(), fetchQuizzes()]);
      setLoading(false);
    };

    initialize();
  }, [navigate]);

  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage and monitor your live quizzes</p>
        </div>
        <button className="create-btn" onClick={() => navigate("/quiz/create")}>
          + Create Quiz
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Sessions</h3>
          <p>{activeSessions.length}</p>
        </div>

        <div className="stat-card">
          <h3>Total Quizzes</h3>
          <p>{quizzes.length}</p>
        </div>

        <div className="stat-card">
          <h3>Total Attempts</h3>
          <p>
            {quizzes.reduce(
              (total, quiz) => total + (quiz.attemptCount || 0),
              0,
            )}
          </p>
        </div>
      </div>

      <div className="quiz-section">
        <h2>All Quizzes</h2>
        <div className="table">
          {quizzes.length === 0 ? (
            <div className="empty-state">
              <p>No quizzes created yet.</p>
              <button className="create-btn">Create Your First Quiz</button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Session Code</th>
                  <th>Quiz Name</th>
                  <th>Status</th>
                  <th>Questions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz._id}>
                    <td>{quiz.sessionCode}</td>
                    <td>{quiz.quizName}</td>
                    <td>
                      {quiz.isActive ? (
                        <span className="status live">
                          <span className="dot"></span> Live
                        </span>
                      ) : (
                        <span className="status closed">
                          <span className="closeddot"></span> Closed
                        </span>
                      )}
                    </td>
                    <td>{quiz.numberOfQuestions}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => {
                          viewQuestions(quiz.sessionCode,quiz.quizName);
                        }}
                      >
                        View
                      </button>
                      {quiz.isActive && (
                        <button
                          className="end-btn"
                          onClick={() => endSession(quiz.sessionCode)}
                        >
                          End
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showQuestions && (
        <div className="float">
          <div className="modal-box">
            <div className="float-header">
              <div className="headings">

              <span><h1>{selectedquizName}</h1><p>({selectedSession})</p></span>
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

export default Dashboard;
