import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { verifyToken, clearAuthData } from "../utils/tokenVerification";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      setIsLoading(true);
      const result = await verifyToken();
      
      if (result.isValid) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        clearAuthData();
      }
      setIsLoading(false);
    };

    checkToken();
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px"
      }}>
        Verifying authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

