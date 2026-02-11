import "./index.css"
import { Routes, Route, Navigate } from "react-router-dom"
import AdminLogin from "./pages/AdminLogin"
import Dashboard from "./pages/Dashboard"
import QuizCreate from "./pages/QuizCreate"
import Layout from "./layout"
import AllQuizzes from "./pages/AllQuizes"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/create" element={<QuizCreate />} />
          <Route path="/allquizzes" element={<AllQuizzes />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App