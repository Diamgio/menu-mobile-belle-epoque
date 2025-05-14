
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;
  }
  
  if (!user) {
    return <Navigate to="/admin" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
