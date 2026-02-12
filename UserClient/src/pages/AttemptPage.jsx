import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../index.css";

const AttemptPage = () => {
    const { sessionCode } = useParams();
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [quizName, setQuizName] = useState("");

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${BASE_URL}/admin/allquestionofsession?sessionCode=${sessionCode}`
                );
                const data = await response.json();
                setQuestions(data.allquestions || []);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchQuizName = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/user/quizname/${sessionCode}`
                );
                const data = await response.json();
                setQuizName(data.quizName);
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        };

        fetchQuizName();
        fetchQuestions();
    }, [sessionCode, BASE_URL]);

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            console.log(answers)
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const email = localStorage.getItem("email");

            console.log("DEBUG DATA:");
            console.log("sessionCode:", sessionCode);
            console.log("email:", email);
            console.log("answers:", answers);

            if (!email) {
                alert("Email missing. Please start quiz again.");
                return;
            }

            const formattedAnswers = Object.keys(answers).map((index) => ({
                questionId: questions[index]._id,
                selectedOption: answers[index],
            }));

            console.log("Formatted Answers:", formattedAnswers);

            const response = await fetch(`${BASE_URL}/user/submitquiz`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionCode,
                    email,
                    answers: formattedAnswers,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Submission failed");
            }

            navigate(`/result/${sessionCode}`);
              

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };
    

    const allAttempted =
        questions.length > 0 &&
        Object.keys(answers).length === questions.length;

    if (loading) return <div className="attempt-page">Loading...</div>;
    if (error) return <div className="attempt-page">Error: {error}</div>;

    return (
        <div className="attempt-page">
            <div className="attempt-page-header">
                <h1>Session Code: {sessionCode}</h1>
                <h1>Quiz Name: {quizName}</h1>
                <h1>Questions: {questions.length}</h1>
            </div>

            <div className="attempt-page-body">


                <div className="container">
                    <div className="attempt-page-body-questions">
                        {questions.map((_, index) => (
                            <div
                                key={index}
                                className="attempt-page-body-question-index-box"
                            >
                                <button
                                    className={`
                                            ${index === currentQuestion ? "active" : ""}
                                            ${answers[index] ? "answered" : "notanswered"}
                                          `}
                                    onClick={() => setCurrentQuestion(index)}
                                >

                                    {index + 1}
                                </button>
                            </div>

                        ))}
                        <div className="Indicators">
                            <div className="indicator-item">
                                <span className="indicator-box answered"></span>
                                <span>Answered</span>
                            </div>

                            <div className="indicator-item">
                                <span className="indicator-box notanswered"></span>
                                <span>Not Answered</span>
                            </div>

                            <div className="indicator-item">
                                <span className="indicator-box selected"></span>
                                <span>Current</span>
                            </div>
                        </div>

                    </div>
                    {questions.length > 0 && (
                        <div className="attempt-page-body-question-content">
                            <p>
                                {currentQuestion + 1}.{" "}
                                {questions[currentQuestion].questionText}
                            </p>

                            <ul className="options-list">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <li key={index}>
                                        <label
                                            className={`attempt-page-body-question-option-box ${answers[currentQuestion] === option.text
                                                ? "selected-option"
                                                : ""
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`option-${currentQuestion}`}
                                                value={option.text}
                                                checked={answers[currentQuestion] === option.text}
                                                onChange={() =>
                                                    setAnswers({
                                                        ...answers,
                                                        [currentQuestion]: option.text,
                                                    })
                                                }
                                            />
                                            <span>{option.text}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    )}


                </div>




                <div className="attempt-page-navigation">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestion === 0}
                    >
                        Previous
                    </button>

                    {allAttempted ? (
                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            className="next-btn"
                            onClick={handleNext}
                            disabled={currentQuestion === questions.length - 1}

                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttemptPage;
