
import { supabase } from "@/integrations/supabase/client";
import { DbCategory } from "../types";
import { useAuth } from "@/contexts/AuthContext";

// Categories service
export const categoriesService = {
  async getAll(restaurantId?: number): Promise<DbCategory[]> {
    let query = supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true });
    
    // Filter by restaurant if ID is provided
    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getCategoryIdByName(name: string, restaurantId?: number): Promise<number | null> {
    let query = supabase
      .from('categories')
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
      console.error('Error fetching category by name:', error);
      throw error;
    }
    
    return data?.id || null;
  },
  
  async createCategory(name: string, restaurantId?: number): Promise<DbCategory> {
    // Get max order_index
    let orderQuery = supabase
      .from('categories')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);
    
    // Filter by restaurant if ID is provided
    if (restaurantId) {
      orderQuery = orderQuery.eq('restaurant_id', restaurantId);
    }
    
    const { data: existingCategories } = await orderQuery;
    
    const nextOrderIndex = existingCategories && existingCategories.length > 0 
      ? (existingCategories[0]?.order_index || 0) + 1 
      : 0;
    
    // Create category with restaurant_id if provided
    const newCategory: Partial<DbCategory> = { 
      name, 
      order_index: nextOrderIndex 
    };
    
    if (restaurantId) {
      newCategory.restaurant_id = restaurantId;
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert(newCategory)
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
