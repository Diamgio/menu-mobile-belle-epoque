
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Restaurant } from "./types";

export const useRestaurantMethods = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const { toast } = useToast();

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
      }

      return data;
    } catch (error) {
      console.error("Error loading restaurants:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare i ristoranti."
      });
      return [];
    }
  };

  // Create a new restaurant using the edge function
  const createRestaurant = async (name: string, subdomain: string): Promise<Restaurant | null> => {
    try {
      // Get the current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        throw new Error("Sessione non valida. Effettua il login.");
      }

      console.log("Creating restaurant with session:", currentSession.access_token.substring(0, 10) + "...");
      
      // Implement retry logic in case of token propagation issues
      const maxRetries = 3;
      let retryCount = 0;
      let response;
      
      while (retryCount < maxRetries) {
        try {
          // Call our edge function to create the restaurant using the service role
          response = await supabase.functions.invoke('create-restaurant', {
            body: { name, subdomain },
            headers: {
              Authorization: `Bearer ${currentSession.access_token}`
            }
          });
          
          // If successful, break out of retry loop
          if (!response.error) break;
          
          console.log(`Retry ${retryCount + 1}/${maxRetries}: Failed with error:`, response.error);
          retryCount++;
          
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (invokeError) {
          console.error(`Retry ${retryCount + 1}/${maxRetries}: Exception:`, invokeError);
          retryCount++;
          
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (response?.error) {
        throw new Error(response.error.message || "Errore durante la creazione del ristorante");
      }
      
      const data = response?.data;
      
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
        description: error instanceof Error ? error.message : "Impossibile creare il ristorante."
      });
      return null;
    }
  };

  return {
    restaurants,
    setRestaurants,
    currentRestaurant,
    setCurrentRestaurant,
    loadRestaurants,
    createRestaurant
  };
};
