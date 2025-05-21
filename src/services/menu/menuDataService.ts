
import { dishesService } from "../dishes/dishesService";
import { categoriesService } from "../categories/categoriesService";
import { allergensService } from "../allergens/allergensService";
import { settingsService } from "../settings/settingsService";
import { 
  transformDbDishToMenuItem, 
  transformDbSettingsToRestaurantInfo 
} from "../transformers/menuTransformers";

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
    // If network error, try to load from cache
    if (!navigator.onLine) {
      console.log("Device is offline, attempting to load data from cache");
      const cachedData = localStorage.getItem('menuData');
      if (cachedData) {
        console.log("Found cached menu data");
        return JSON.parse(cachedData);
      }
    }
    
    console.error("Error loading menu data:", error);
    throw error;
  }
}
