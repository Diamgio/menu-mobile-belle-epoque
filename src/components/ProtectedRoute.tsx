
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const { user, loading, restaurants } = useAuth();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifica autenticazione...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/admin" replace />;
  }
  
  // If user is authenticated but has no restaurants, we need to let them create one
  // This will be handled by the Dashboard component itself
  
  return <Outlet />;
};

export default ProtectedRoute;
