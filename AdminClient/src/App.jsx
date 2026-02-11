import "./index.css"
import { Routes, Route} from "react-router-dom"
import AdminLogin from "./pages/AdminLogin"
import Dashboard from "./pages/Dashboard"
import QuizCreate from "./pages/QuizCreate"
import Layout from "./layout"
import AllQuizzes from "./pages/AllQuizes"

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/create" element={<QuizCreate />} />
        <Route path="/allquizzes" element={<AllQuizzes />} />
       
      </Route>
    </Routes>
  )
}

export default App