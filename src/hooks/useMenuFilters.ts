
import { useState, useEffect, useMemo } from "react";
import { MenuItem } from "@/types/menu";

interface UseMenuFiltersResult {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  excludedAllergens: string[];
  handleAllergenChange: (allergen: string) => void;
  filteredItems: MenuItem[];
}

export const useMenuFilters = (menuItems: MenuItem[]): UseMenuFiltersResult => {
  console.log("useMenuFilters hook initializing with items count:", Array.isArray(menuItems) ? menuItems.length : 0);
  
  // ALWAYS call hooks unconditionally at the top level
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);

  // Ensure menuItems is an array before operations
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];

  // Handle allergen selection
  const handleAllergenChange = (allergen: string) => {
    console.log(`Allergen toggle: ${allergen}`);
    setExcludedAllergens((current) =>
      current.includes(allergen)
        ? current.filter((a) => a !== allergen)
        : [...current, allergen]
    );
  };

  // Use useMemo for filtering logic to avoid recalculations on every render
  const filteredItems = useMemo(() => {
    try {
      console.log(`Filtering ${safeMenuItems.length} items with category=${activeCategory}, excludedAllergens=${excludedAllergens.length}`);
      
      // Always return an array, even if it's empty
      return safeMenuItems.filter((item) => {
        // Skip null/undefined items
        if (!item) return false;
        
        // Filter by category if one is selected
        if (activeCategory && item.category !== activeCategory) {
          return false;
        }
        
        // Filter by excluded allergens
        if (excludedAllergens.length > 0 && Array.isArray(item.allergens)) {
          if (item.allergens.some(allergen => excludedAllergens.includes(allergen))) {
            return false;
          }
        }
        
        return true;
      });
    } catch (e) {
      console.error("Error filtering items:", e);
      return [];
    }
  }, [safeMenuItems, activeCategory, excludedAllergens]);

  useEffect(() => {
    console.log(`Filtered items count: ${filteredItems.length}`);
  }, [filteredItems.length]);

  // Always return the same structure with no conditional returns
  return {
    activeCategory,
    setActiveCategory,
    excludedAllergens,
    handleAllergenChange,
    filteredItems
  };
};
