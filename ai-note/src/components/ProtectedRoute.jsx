import { useAuthCheck } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { authState } = useAuthCheck();

  if (!authState.isAuthenticated) {
    console.log("User not authenticated, redirecting to login.");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
