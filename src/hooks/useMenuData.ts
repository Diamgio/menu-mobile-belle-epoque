
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

export const useMenuData = (): UseMenuDataResult => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "Caricamento...",
    openingHours: "",
    phone: "",
    address: "",
    socialLinks: {},
    logo: "/placeholder.svg"
  });
  
  // Fetch menu data from Supabase
  const { data, isLoading, error } = useQuery({
    queryKey: ['menuData'],
    queryFn: loadMenuData
  });
  
  // Load cached data when offline
  useEffect(() => {
    // Try to load from cache while loading
    if (isLoading) {
      const cachedData = localStorage.getItem('menuData');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setMenuItems(parsedData.menuItems);
          setCategories(parsedData.categories);
          setAllergens(parsedData.allergens);
          setRestaurantInfo(parsedData.restaurantInfo);
          
          window.__menuContext = {
            items: parsedData.menuItems
          };
          
          console.log("Loaded menu data from cache while waiting for API");
        } catch (e) {
          console.error("Error parsing cached data:", e);
        }
      }
    }
  }, [isLoading]);
  
  useEffect(() => {
    if (data) {
      setMenuItems(data.menuItems);
      setCategories(data.categories);
      setAllergens(data.allergens);
      setRestaurantInfo(data.restaurantInfo);
      
      // Make menu items available globally for the ZoomableImage component
      window.__menuContext = {
        items: data.menuItems
      };
      
      // Store the menu data in localStorage for offline access
      try {
        localStorage.setItem('menuData', JSON.stringify(data));
        console.log("Menu data cached in localStorage for offline use");
      } catch (e) {
        console.error("Error caching menu data:", e);
      }
      
      console.log("Menu data loaded:", { 
        itemsCount: data.menuItems.length,
        categories: data.categories,
        allergens: data.allergens
      });
    }
  }, [data]);

  return {
    menuItems,
    categories,
    allergens,
    restaurantInfo,
    isLoading,
    error: error as Error | null
  };
};
