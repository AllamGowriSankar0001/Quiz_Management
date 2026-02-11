import "./index.css";
import { Routes, Route } from "react-router-dom";
import Form from "./pages/UserLogin";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/quiz/:sessionCode" element={<Form />} />
    </Routes>
  );
};

export default App;
