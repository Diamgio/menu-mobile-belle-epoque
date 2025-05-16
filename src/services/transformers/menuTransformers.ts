
import { MenuItem, RestaurantInfo } from "@/types/menu";
import { supabase } from "@/integrations/supabase/client";
import { DbDish, DbSettings } from "../types";
import { dishesService } from "../dishes/dishesService";
import { categoriesService } from "../categories/categoriesService";
import { allergensService } from "../allergens/allergensService";

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
      socialLinks: {},
      logo: "/placeholder.svg" // Use placeholder SVG as fallback
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
    },
    logo: dbSettings.logo_url || "/placeholder.svg" // Added fallback to placeholder if logo_url is null
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
    other_social: null,
    logo_url: info.logo || null
  };
}
