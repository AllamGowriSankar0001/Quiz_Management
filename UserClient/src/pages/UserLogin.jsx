import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Form() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_USER_FRONTEND_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionCode) {
      setCode(sessionCode);
    }
  }, [sessionCode]);

  const handleStartQuiz = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !code) {
      return setError("All fields are required.");
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/user/startquiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          sessionCode: code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      navigate(`/attempt/${code}`, {
        state: {
          questions: data.questions,
          quizName: data.quizName,
        },
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form">
        <form onSubmit={handleStartQuiz}>
          <div className="text">
            <h2>Join Quiz</h2>
            <p className="subtitle">
              Enter your details to start the quiz
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="name">
              Name : <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email : <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sessionCode">
              Session Code : <span className="required">*</span>
            </label>
            <input
              type="text"
              id="sessionCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter session code"
              readOnly={!!sessionCode}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Starting..." : "Start Quiz"}
          </button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </>
  );
}

export default Form;
