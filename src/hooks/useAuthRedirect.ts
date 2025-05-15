
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface UseAuthRedirectProps {
  redirectTo: string;
  shouldBeAuthenticated?: boolean;
}

/**
 * Hook per gestire i reindirizzamenti basati sullo stato di autenticazione
 * @param redirectTo percorso a cui reindirizzare
 * @param shouldBeAuthenticated se true, reindirizza gli utenti NON autenticati; se false, reindirizza gli utenti autenticati
 */
export function useAuthRedirect({ 
  redirectTo, 
  shouldBeAuthenticated = true 
}: UseAuthRedirectProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Aspetta che l'autenticazione sia caricata prima di reindirizzare
    if (!loading) {
      const isAuthenticated = !!user;
      
      if (shouldBeAuthenticated && !isAuthenticated) {
        // Reindirizza al login se l'utente dovrebbe essere autenticato ma non lo è
        navigate(redirectTo, { replace: true });
      } else if (!shouldBeAuthenticated && isAuthenticated) {
        // Reindirizza alla dashboard se l'utente non dovrebbe essere autenticato ma lo è
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, loading, navigate, redirectTo, shouldBeAuthenticated]);

  return { isAuthenticated: !!user, loading };
}
