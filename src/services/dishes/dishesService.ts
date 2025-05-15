
import { supabase } from "@/integrations/supabase/client";
import { DbDish } from "../types";

// Dishes service
export const dishesService = {
  async getAll(): Promise<DbDish[]> {
    const { data, error } = await supabase
      .from('dishes')
      .select('*');
    
    if (error) {
      console.error('Error fetching dishes:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async createDish(dish: Omit<DbDish, 'id'>): Promise<DbDish> {
    const { data, error } = await supabase
      .from('dishes')
      .insert(dish)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating dish:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned when creating dish');
    }
    
    return data;
  },
  
  async updateDish(id: number, dish: Partial<DbDish>): Promise<DbDish> {
    const { data, error } = await supabase
      .from('dishes')
      .update(dish)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating dish:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned when updating dish');
    }
    
    return data;
  },
  
  async deleteDish(id: number): Promise<void> {
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting dish:', error);
      throw error;
    }
  },
  
  async getDishAllergens(dishId: number): Promise<string[]> {
    const { data, error } = await supabase
      .from('dish_allergens')
      .select(`
        allergen_id,
        allergens (
          name
        )
      `)
      .eq('dish_id', dishId);
    
    if (error) {
      console.error('Error fetching dish allergens:', error);
      throw error;
    }
    
    return data.map(item => item.allergens?.name || '').filter(Boolean);
  },
  
  async updateDishAllergens(dishId: number, allergenIds: number[]): Promise<void> {
    // First delete all existing allergens for this dish
    const { error: deleteError } = await supabase
      .from('dish_allergens')
      .delete()
      .eq('dish_id', dishId);
    
    if (deleteError) {
      console.error('Error deleting existing dish allergens:', deleteError);
      throw deleteError;
    }
    
    // Only insert if there are allergens to add
    if (allergenIds.length > 0) {
      const dishAllergens = allergenIds.map(allergenId => ({
        dish_id: dishId,
        allergen_id: allergenId
      }));
      
      const { error: insertError } = await supabase
        .from('dish_allergens')
        .insert(dishAllergens);
      
      if (insertError) {
        console.error('Error inserting dish allergens:', insertError);
        throw insertError;
      }
    }
  }
};
