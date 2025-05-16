
import { supabase } from "@/integrations/supabase/client";
import { DbAllergen } from "../types";
import { useAuth } from "@/contexts/AuthContext";

// Allergens service
export const allergensService = {
  async getAll(restaurantId?: number): Promise<DbAllergen[]> {
    let query = supabase
      .from('allergens')
      .select('*')
      .order('name');
    
    // Filter by restaurant if ID is provided
    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching allergens:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getAllergenIdByName(name: string, restaurantId?: number): Promise<number | null> {
    let query = supabase
      .from('allergens')
      .select('id')
      .eq('name', name);
    
    // Filter by restaurant if ID is provided
    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('Error fetching allergen by name:', error);
      throw error;
    }
    
    return data?.id || null;
  },
  
  async createAllergen(name: string, restaurantId?: number): Promise<DbAllergen> {
    // Create allergen with restaurant_id if provided
    const newAllergen: Partial<DbAllergen> = { name };
    
    if (restaurantId) {
      newAllergen.restaurant_id = restaurantId;
    }
    
    const { data, error } = await supabase
      .from('allergens')
      .insert(newAllergen)
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
