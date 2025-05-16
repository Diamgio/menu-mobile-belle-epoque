
import { createContext, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "./types";
import { useAuthMethods } from "./useAuthMethods";
import { useRestaurantMethods } from "./useRestaurantMethods";
import { useSubscriptionMethods } from "./useSubscriptionMethods";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    session,
    setSession,
    user,
    setUser,
    loading,
    setLoading,
    signIn,
    signUp,
    signOut
  } = useAuthMethods();

  const {
    restaurants,
    setRestaurants,
    currentRestaurant,
    setCurrentRestaurant,
    loadRestaurants,
    createRestaurant
  } = useRestaurantMethods();

  const {
    subscription,
    setSubscription,
    checkSubscription,
    createSubscription,
    manageSubscription
  } = useSubscriptionMethods();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user is authenticated, load their restaurants
        if (session?.user) {
          setTimeout(() => {
            loadRestaurants();
          }, 0);
        } else {
          // Reset state when logged out
          setRestaurants([]);
          setCurrentRestaurant(null);
          setSubscription(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // If user is authenticated, load their restaurants
      if (session?.user) {
        loadRestaurants();
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  // Check subscription when restaurant changes
  useEffect(() => {
    if (currentRestaurant) {
      checkSubscription(currentRestaurant.id);
    }
  }, [currentRestaurant]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp,
      signOut,
      createRestaurant,
      restaurants,
      currentRestaurant,
      setCurrentRestaurant,
      loadRestaurants,
      subscription,
      checkSubscription,
      createSubscription,
      manageSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
