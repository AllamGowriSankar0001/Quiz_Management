import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../utils/tokenVerification";

function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const result = await verifyToken();
      if (result.isValid) {
        navigate("/dashboard", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);
  const handlelogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      return setError("Hey Admin,Both email and password are required.");
    }
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      if (!data || !data.YOUR_TOKEN) {
        throw new Error(data.message || "Login failed - No token received");
      }
      
      localStorage.setItem("userData", JSON.stringify(data));
      localStorage.setItem("token", data.YOUR_TOKEN);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="form">
        <form onSubmit={handlelogin}>
          <div className="text">

            <h2>Admin Login</h2>
            <p className="subtitle">Sign in to access your Admin Dashboard</p>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address : <span className="required">*</span></label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password : <span className="required">*</span></label>
            <input
              type={show ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to continue"
            />
            <i
              className={`showbtn fa-regular ${show ? "fa-eye-slash" : "fa-eye"} eye-icon`}
              onClick={() => setShow(!show)}></i>
          </div>
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </>
  );
}
export default Form;
