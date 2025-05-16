
import { supabase } from "@/integrations/supabase/client";
import { DbCategory } from "../types";

// Categories service
export const categoriesService = {
  async getAll(): Promise<DbCategory[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getCategoryIdByName(name: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('Error fetching category by name:', error);
      throw error;
    }
    
    return data?.id || null;
  },
  
  async createCategory(name: string): Promise<DbCategory> {
    // Get max order_index
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);
    
    const nextOrderIndex = existingCategories && existingCategories.length > 0 
      ? (existingCategories[0]?.order_index || 0) + 1 
      : 0;
    
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, order_index: nextOrderIndex })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned when creating category');
    }
    
    return data;
  }
};
