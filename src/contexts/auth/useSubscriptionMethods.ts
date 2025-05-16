
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Subscription } from "./types";

export const useSubscriptionMethods = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

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

  return {
    subscription,
    setSubscription,
    checkSubscription,
    createSubscription,
    manageSubscription
  };
};
