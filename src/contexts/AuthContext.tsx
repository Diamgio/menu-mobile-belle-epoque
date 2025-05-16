
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Restaurant {
  id: number;
  name: string;
  subdomain: string;
  logo_url?: string;
}

interface Subscription {
  active: boolean;
  status?: string;
  current_period_end?: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  createRestaurant: (name: string, subdomain: string) => Promise<Restaurant | null>;
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  loadRestaurants: () => Promise<void>;
  subscription: Subscription | null;
  checkSubscription: (restaurantId: number) => Promise<void>;
  createSubscription: (restaurantId: number) => Promise<string | null>;
  manageSubscription: (restaurantId: number) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  createRestaurant: async () => null,
  restaurants: [],
  currentRestaurant: null,
  setCurrentRestaurant: () => {},
  loadRestaurants: async () => {},
  subscription: null,
  checkSubscription: async () => {},
  createSubscription: async () => null,
  manageSubscription: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user is authenticated, load their restaurants
        if (session?.user) {
          setTimeout(() => {
            loadRestaurants();
          }, 0);
        } else {
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

    return () => subscription.unsubscribe();
  }, []);

  // Load user's restaurants
  const loadRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setRestaurants(data || []);
      
      // If we have restaurants but no current restaurant selected, select the first one
      if (data && data.length > 0 && !currentRestaurant) {
        setCurrentRestaurant(data[0]);
        
        // Check subscription status for the selected restaurant
        checkSubscription(data[0].id);
      }
    } catch (error) {
      console.error("Error loading restaurants:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare i ristoranti."
      });
    }
  };

  // Create a new restaurant
  const createRestaurant = async (name: string, subdomain: string): Promise<Restaurant | null> => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert({ name, subdomain, user_id: user?.id })
        .select()
        .single();
      
      if (error) throw error;
      
      // Reload restaurants to include the new one
      await loadRestaurants();
      
      // Set the new restaurant as current
      if (data) {
        setCurrentRestaurant(data);
      }
      
      return data;
    } catch (error) {
      console.error("Error creating restaurant:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile creare il ristorante."
      });
      return null;
    }
  };

  // Check subscription status
  const checkSubscription = async (restaurantId: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { restaurantId }
      });
      
      if (error) throw error;
      
      setSubscription(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription({ active: false });
    }
  };

  // Create a subscription
  const createSubscription = async (restaurantId: number): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { restaurantId }
      });
      
      if (error) throw error;
      
      return data.url;
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile creare l'abbonamento."
      });
      return null;
    }
  };

  // Manage subscription
  const manageSubscription = async (restaurantId: number): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { restaurantId }
      });
      
      if (error) throw error;
      
      return data.url;
    } catch (error) {
      console.error("Error managing subscription:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile gestire l'abbonamento."
      });
      return null;
    }
  };

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
