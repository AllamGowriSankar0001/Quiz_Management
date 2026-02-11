import { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { verifyToken, clearAuthData } from "../utils/tokenVerification";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    
    const checkToken = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token || token === "null" || token === "undefined" || token.trim() === "") {
        if (isMounted) {
          setIsAuthenticated(false);
          clearAuthData();
          setIsLoading(false);
        }
        return;
      }

      try {
        const result = await verifyToken();
        
        if (isMounted) {
          if (result.isValid === true) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            clearAuthData();
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          clearAuthData();
          setIsLoading(false);
        }
      }
    };

    checkToken();
    
    return () => {
      isMounted = false;
    };
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

  return <Outlet />;
};

export default ProtectedRoute;

