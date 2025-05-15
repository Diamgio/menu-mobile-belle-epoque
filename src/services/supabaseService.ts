
// This file re-exports all services for backward compatibility
import { categoriesService } from "./categories/categoriesService";
import { allergensService } from "./allergens/allergensService";
import { dishesService } from "./dishes/dishesService";
import { settingsService } from "./settings/settingsService";
import { loadMenuData } from "./menu/menuDataService";
import { 
  transformDbDishToMenuItem,
  transformMenuItemToDbDish,
  transformDbSettingsToRestaurantInfo,
  transformRestaurantInfoToDbSettings
} from "./transformers/menuTransformers";
import { 
  DbDish, 
  DbCategory, 
  DbAllergen, 
  DbSettings 
} from "./types";

// Re-export everything for backward compatibility
export {
  categoriesService,
  allergensService,
  dishesService,
  settingsService,
  loadMenuData,
  transformDbDishToMenuItem,
  transformMenuItemToDbDish,
  transformDbSettingsToRestaurantInfo,
  transformRestaurantInfoToDbSettings
};

// Re-export types
export type {
  DbDish,
  DbCategory,
  DbAllergen,
  DbSettings
};
