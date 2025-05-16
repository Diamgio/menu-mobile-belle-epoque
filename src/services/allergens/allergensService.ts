
import { supabase } from "@/integrations/supabase/client";
import { DbAllergen } from "../types";

// Allergens service
export const allergensService = {
  async getAll(): Promise<DbAllergen[]> {
    const { data, error } = await supabase
      .from('allergens')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching allergens:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getAllergenIdByName(name: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('allergens')
      .select('id')
      .eq('name', name)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('Error fetching allergen by name:', error);
      throw error;
    }
    
    return data?.id || null;
  },
  
  async createAllergen(name: string): Promise<DbAllergen> {
    const { data, error } = await supabase
      .from('allergens')
      .insert({ name })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating allergen:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned when creating allergen');
    }
    
    return data;
  }
};
