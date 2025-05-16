
import { supabase } from "@/integrations/supabase/client";
import { DbSettings } from "../types";

// Restaurant settings service
export const settingsService = {
  async getSettings(restaurantId?: number): Promise<DbSettings | null> {
    let query = supabase
      .from('settings')
      .select('*')
      .order('id')
      .limit(1);
    
    // Filter by restaurant if ID is provided
    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('Error fetching settings:', error);
      throw error;
    }
    
    return data;
  },
  
  async saveSettings(settings: Omit<DbSettings, 'id'>, restaurantId?: number): Promise<DbSettings> {
    // Check if we have settings already for this restaurant
    let findQuery = supabase
      .from('settings')
      .select('id');
    
    // Filter by restaurant if ID is provided
    if (restaurantId) {
      findQuery = findQuery.eq('restaurant_id', restaurantId);
    }
    
    const { data: existing } = await findQuery.maybeSingle();
    
    // Add restaurant_id to settings if provided
    const settingsToSave = { ...settings };
    if (restaurantId) {
      settingsToSave.restaurant_id = restaurantId;
    }
    
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('settings')
        .update(settingsToSave)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating settings:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned when updating settings');
      }
      
      return data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('settings')
        .insert(settingsToSave)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating settings:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned when creating settings');
      }
      
      return data;
    }
  }
};
