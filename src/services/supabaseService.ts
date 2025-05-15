
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, RestaurantInfo } from "@/types/menu";

// Types that match Supabase schema
export interface DbDish {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category_id: number | null;
  image_url: string | null;
}

export interface DbCategory {
  id: number;
  name: string;
  order_index: number | null;
}

export interface DbAllergen {
  id: number;
  name: string;
  icon: string | null;
}

export interface DbSettings {
  id: number;
  restaurant_name: string | null;
  address: string | null;
  phone: string | null;
  opening_hours: any | null;
  facebook_url: string | null;
  instagram_url: string | null;
  other_social: string | null;
}

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

// Data transformation functions
export async function transformDbDishToMenuItem(dbDish: DbDish): Promise<MenuItem> {
  // Get the category name
  const { data: categoryData } = await supabase
    .from('categories')
    .select('name')
    .eq('id', dbDish.category_id)
    .single();
  
  // Get allergens for this dish
  const allergens = await dishesService.getDishAllergens(dbDish.id);
  
  return {
    id: dbDish.id.toString(),
    name: dbDish.name,
    description: dbDish.description || "",
    price: dbDish.price || 0,
    category: categoryData?.name || "Altri",
    image: dbDish.image_url || "/placeholder.svg",
    allergens: allergens
  };
}

export async function transformMenuItemToDbDish(menuItem: Omit<MenuItem, "id">, existingId?: string): Promise<{ dish: Omit<DbDish, "id"> | DbDish, allergenIds: number[] }> {
  // Get or create category
  let categoryId = await categoriesService.getCategoryIdByName(menuItem.category);
  
  if (categoryId === null) {
    const newCategory = await categoriesService.createCategory(menuItem.category);
    categoryId = newCategory.id;
  }
  
  // Handle allergens
  const allergenIds = await Promise.all(
    menuItem.allergens.map(async (allergenName) => {
      let allergenId = await allergensService.getAllergenIdByName(allergenName);
      
      if (allergenId === null) {
        const newAllergen = await allergensService.createAllergen(allergenName);
        allergenId = newAllergen.id;
      }
      
      return allergenId;
    })
  );
  
  const dish: any = {
    name: menuItem.name,
    description: menuItem.description,
    price: menuItem.price,
    category_id: categoryId,
    image_url: menuItem.image !== "/placeholder.svg" ? menuItem.image : null
  };
  
  if (existingId) {
    dish.id = parseInt(existingId, 10);
  }
  
  return { dish, allergenIds };
}

export async function transformDbSettingsToRestaurantInfo(dbSettings: DbSettings | null): Promise<RestaurantInfo> {
  if (!dbSettings) {
    // Return default settings if none exist
    return {
      name: "Ristorante",
      openingHours: "Contattaci per gli orari",
      phone: "",
      address: "",
      socialLinks: {}
    };
  }
  
  return {
    name: dbSettings.restaurant_name || "Ristorante",
    openingHours: dbSettings.opening_hours ? 
      (typeof dbSettings.opening_hours === 'string' ? 
        dbSettings.opening_hours : 
        JSON.stringify(dbSettings.opening_hours)) :
      "Contattaci per gli orari",
    phone: dbSettings.phone || "",
    address: dbSettings.address || "",
    socialLinks: {
      facebook: dbSettings.facebook_url || undefined,
      instagram: dbSettings.instagram_url || undefined
    }
  };
}

export async function transformRestaurantInfoToDbSettings(info: RestaurantInfo): Promise<Omit<DbSettings, "id">> {
  return {
    restaurant_name: info.name,
    address: info.address,
    phone: info.phone,
    opening_hours: info.openingHours,
    facebook_url: info.socialLinks.facebook || null,
    instagram_url: info.socialLinks.instagram || null,
    other_social: null
  };
}

// Function to load all menu data
export async function loadMenuData() {
  try {
    // Get all dishes
    const dbDishes = await dishesService.getAll();
    
    // Transform dishes to menu items
    const menuItems = await Promise.all(
      dbDishes.map(dish => transformDbDishToMenuItem(dish))
    );
    
    // Get all categories
    const dbCategories = await categoriesService.getAll();
    const categories = dbCategories.map(cat => cat.name);
    
    // Get all allergens
    const dbAllergens = await allergensService.getAll();
    const allergens = dbAllergens.map(allergen => allergen.name);
    
    // Get restaurant info
    const dbSettings = await settingsService.getSettings();
    const restaurantInfo = await transformDbSettingsToRestaurantInfo(dbSettings);
    
    return { menuItems, categories, allergens, restaurantInfo };
  } catch (error) {
    console.error("Error loading menu data:", error);
    throw error;
  }
}
