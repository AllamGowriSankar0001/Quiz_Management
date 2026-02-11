import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const QuizCreate = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const [formData, setFormData] = useState({
    quizName: "",
    sessionCode: "",
  });

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleQuestionTextChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = value;
    setQuestions(updated);
  };

  const handleCorrectChange = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === optIndex,
    }));
    setQuestions(updated);
  };

  const addQuestionBlock = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        options: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestionBlock = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const Token = localStorage.getItem("token");

    const questionsList = questions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
    }));

    try {
      const res = await fetch(`${BASE_URL}/admin/createquiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify({
          quizName: formData.quizName,
          sessionCode: formData.sessionCode,
          questionsList,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      if (!data?.QuizData?.sessionCode && !formData.sessionCode) {
        throw new Error("Quiz created but session code missing");
      }

      navigate("/allquizzes");
    } catch (err) {
      setError(err.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-create">
      <div className="quiz-create__header">
        <h1 className="quiz-create__title">Create New Quiz</h1>
        <p className="quiz-create__subtitle">
          Set up a new quiz session by providing basic details below.
        </p>
      </div>

      <form className="quiz-create__form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Name</label>
          <input
            type="text"
            name="quizName"
            placeholder="Enter quiz name"
            value={formData.quizName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Session Code</label>
          <input
            type="text"
            name="sessionCode"
            placeholder="Unique session code"
            value={formData.sessionCode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="questions-section">
          <h2 className="questions-section__title">Questions</h2>
          <p className="questions-section__subtitle">
            Add each question with its options. At least one question is
            required.
          </p>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-block">
              <div className="question-block__header">
                <h3>Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="question-block__remove"
                    onClick={() => removeQuestionBlock(qIndex)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionTextChange(qIndex, e.target.value)
                  }
                  placeholder="Enter question text"
                  required
                />
              </div>

              <div className="form-group">
                <label className="Options-label">Options (select the correct one)</label>
                <div className="options-list">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="option-row">
                      <input
                        
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={opt.isCorrect}
                        onChange={() =>
                          handleCorrectChange(qIndex, optIndex)
                        }
                      />
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) =>
                          handleOptionChange(
                            qIndex,
                            optIndex,
                            e.target.value,
                          )
                        }
                        placeholder={`Option ${optIndex + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-question-button"
            onClick={addQuestionBlock}
          >
            + Add Another Question
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Quiz"}
        </button>
      </form>
    </div>
  );
};

export default QuizCreate;
