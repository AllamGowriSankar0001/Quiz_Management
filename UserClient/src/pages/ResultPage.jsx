import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../index.css";

function ResultPage() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [score, setScore] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const storedEmail = localStorage.getItem("email");

        if (!storedEmail) {
          setError("Email not found. Please start quiz again.");
          return;
        }

        const response = await fetch(`${BASE_URL}/user/getresult`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionCode,
            email: storedEmail,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch result");
        }

        setScore(data.score);
        setTotalQuestions(data.totalQuestions);
        setEmail(storedEmail);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [sessionCode, BASE_URL]);

  if (loading) return <div className="result-loading">Loading...</div>;
  if (error) return <div className="result-error">{error}</div>;

  // ✅ Safe percentage calculation
  const percentage =
    totalQuestions > 0
      ? ((score / totalQuestions) * 100).toFixed(1)
      : 0;

  const passed = percentage >= 40;

  

  return (
    <div className="result-container">
      <div className="result-card">
        <h1 className="result-title">Quiz Completed</h1>

        <p className="result-subtext">
          Thank you <strong>{email}</strong> for completing the quiz.
        </p>

        <p className="result-session">
          Session Code: <strong>{sessionCode}</strong>
        </p>

        <div className="result-score">
          <h2>
            {score} / {totalQuestions}
          </h2>
          <p>
            You answered {score} questions correctly out of {totalQuestions}.
          </p>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <h3 className="result-percentage">
          {percentage}% {passed ? "🎉 Passed" : "❌ Failed"}
        </h3>


        <p className="result-note">
          {passed
            ? "You have successfully passed the quiz. Excellent work!"
            : "Keep learning and improving. This result reflects your current understanding of the topic."
        }
        </p>

        <button
          className="result-btn"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default ResultPage;
