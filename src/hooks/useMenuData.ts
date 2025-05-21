
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuItem, RestaurantInfo } from "@/types/menu";
import { loadMenuData } from "@/services/supabaseService";

interface UseMenuDataResult {
  menuItems: MenuItem[];
  categories: string[];
  allergens: string[];
  restaurantInfo: RestaurantInfo;
  isLoading: boolean;
  error: Error | null;
}

// Default restaurant info to avoid undefined values
const defaultRestaurantInfo: RestaurantInfo = {
  name: "Caricamento...",
  openingHours: "",
  phone: "",
  address: "",
  socialLinks: {},
  logo: "/placeholder.svg"
};

export const useMenuData = (): UseMenuDataResult => {
  console.log("useMenuData hook initializing");
  
  // Always initialize all state values
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(defaultRestaurantInfo);
  
  // Fetch menu data from Supabase
  const { data, isLoading, error } = useQuery({
    queryKey: ['menuData'],
    queryFn: loadMenuData
  });
  
  console.log("Query state:", { isLoading, hasError: !!error, hasData: !!data });
  
  // Load cached data effect
  useEffect(() => {
    console.log("Cache loading effect running, isLoading:", isLoading);
    // Try to load from cache while loading
    if (isLoading) {
      const cachedData = localStorage.getItem('menuData');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          
          // Always use default values as fallbacks
          const menuItemsData = Array.isArray(parsedData.menuItems) ? parsedData.menuItems : [];
          const categoriesData = Array.isArray(parsedData.categories) ? parsedData.categories : [];
          const allergensData = Array.isArray(parsedData.allergens) ? parsedData.allergens : [];
          const restaurantInfoData = parsedData.restaurantInfo || defaultRestaurantInfo;
          
          setMenuItems(menuItemsData);
          setCategories(categoriesData);
          setAllergens(allergensData);
          setRestaurantInfo(restaurantInfoData);
          
          // Set global context
          window.__menuContext = {
            items: menuItemsData
          };
          
          console.log("Loaded menu data from cache while waiting for API", {
            itemsCount: menuItemsData.length,
            categoriesCount: categoriesData.length,
            allergensCount: allergensData.length
          });
        } catch (e) {
          console.error("Error parsing cached data:", e);
        }
      }
    }
  }, [isLoading]);
  
  // Process API data effect
  useEffect(() => {
    console.log("API data effect running, hasData:", !!data);
    if (data) {
      const menuItemsData = Array.isArray(data.menuItems) ? data.menuItems : [];
      const categoriesData = Array.isArray(data.categories) ? data.categories : [];
      const allergensData = Array.isArray(data.allergens) ? data.allergens : [];
      const restaurantInfoData = data.restaurantInfo || defaultRestaurantInfo;
      
      setMenuItems(menuItemsData);
      setCategories(categoriesData);
      setAllergens(allergensData);
      setRestaurantInfo(restaurantInfoData);
      
      // Make menu items available globally for the ZoomableImage component
      window.__menuContext = {
        items: menuItemsData
      };
      
      // Store the menu data in localStorage for offline access
      try {
        localStorage.setItem('menuData', JSON.stringify({
          menuItems: menuItemsData,
          categories: categoriesData,
          allergens: allergensData,
          restaurantInfo: restaurantInfoData
        }));
        console.log("Menu data cached in localStorage for offline use");
      } catch (e) {
        console.error("Error caching menu data:", e);
      }
      
      console.log("Menu data loaded from API:", { 
        itemsCount: menuItemsData.length,
        categoriesCount: categoriesData.length,
        allergensCount: allergensData.length
      });
    }
  }, [data]);

  // Always return a consistent structure with no conditional returns
  return {
    menuItems,
    categories,
    allergens,
    restaurantInfo,
    isLoading,
    error: error as Error | null
  };
};
