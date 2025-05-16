
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthMethods = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    
    if (!result.error && result.data.session) {
      navigate("/admin/dashboard");
    }
    
    return result;
  };

  const signUp = async (email: string, password: string) => {
    const result = await supabase.auth.signUp({ email, password });
    
    if (!result.error && result.data.user) {
      toast({
        title: "Registrazione completata",
        description: "Account creato con successo."
      });
      // Don't navigate yet - we'll do that after creating a restaurant
    }
    
    return result;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  return {
    session,
    setSession,
    user, 
    setUser,
    loading,
    setLoading,
    signIn,
    signUp,
    signOut
  };
};
