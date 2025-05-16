
import { dishesService } from "../dishes/dishesService";
import { categoriesService } from "../categories/categoriesService";
import { allergensService } from "../allergens/allergensService";
import { settingsService } from "../settings/settingsService";
import { 
  transformDbDishToMenuItem, 
  transformDbSettingsToRestaurantInfo 
} from "../transformers/menuTransformers";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Function to load all menu data
export async function loadMenuData(restaurantId?: number) {
  try {
    let effectiveRestaurantId = restaurantId;
    
    // If no restaurant ID was provided, try to get it from the current restaurant
    if (!effectiveRestaurantId) {
      try {
        // This is a bit of a hack since we're outside React and can't use hooks directly
        // In a real app, you'd probably pass this through parameters or use a different state management solution
        const authContext = (window as any).__authContext;
        if (authContext && authContext.currentRestaurant) {
          effectiveRestaurantId = authContext.currentRestaurant.id;
        }
      } catch (error) {
        console.log("No auth context available");
      }
    }
    
    // If we still don't have a restaurant ID and we're in a public context, try to get a default one
    if (!effectiveRestaurantId) {
      // Get the first restaurant (for public demo purposes)
      const { data: firstRestaurant } = await supabase
        .from('restaurants')
        .select('id')
        .order('id')
        .limit(1)
        .single();
      
      if (firstRestaurant) {
        effectiveRestaurantId = firstRestaurant.id;
      }
    }
    
    // Get all dishes
    const dbDishes = await dishesService.getAll(effectiveRestaurantId);
    
    // Transform dishes to menu items
    const menuItems = await Promise.all(
      dbDishes.map(dish => transformDbDishToMenuItem(dish))
    );
    
    // Get all categories
    const dbCategories = await categoriesService.getAll(effectiveRestaurantId);
    const categories = dbCategories.map(cat => cat.name);
    
    // Get all allergens
    const dbAllergens = await allergensService.getAll(effectiveRestaurantId);
    const allergens = dbAllergens.map(allergen => allergen.name);
    
    // Get restaurant info
    const dbSettings = await settingsService.getSettings(effectiveRestaurantId);
    const restaurantInfo = await transformDbSettingsToRestaurantInfo(dbSettings);
    
    return { menuItems, categories, allergens, restaurantInfo };
  } catch (error) {
    console.error("Error loading menu data:", error);
    throw error;
  }
}
