
import { supabase } from "@/integrations/supabase/client";
import { DbSettings } from "../types";

// Restaurant settings service
export const settingsService = {
  async getSettings(): Promise<DbSettings | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('id')
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('Error fetching settings:', error);
      throw error;
    }
    
    return data;
  },
  
  async saveSettings(settings: Omit<DbSettings, 'id'>): Promise<DbSettings> {
    // Check if we have settings already
    const existing = await this.getSettings().catch(() => null);
    
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('settings')
        .update(settings)
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
        .insert(settings)
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
