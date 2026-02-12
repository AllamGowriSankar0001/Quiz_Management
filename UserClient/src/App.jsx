import "./index.css";
import { Routes, Route } from "react-router-dom";
import Form from "./pages/UserLogin";
import AttemptPage from "./pages/AttemptPage";
import ResultPage from "./pages/ResultPage";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/quiz/:sessionCode" element={<Form />} />
      <Route path="/attempt/:sessionCode" element={<AttemptPage />} />
      <Route path="/result/:sessionCode" element={<ResultPage />} />

    </Routes>
  );
};

export default App;
