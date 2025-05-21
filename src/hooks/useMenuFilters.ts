
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
  console.log("useMenuFilters hook initializing");
  
  // Always call hooks unconditionally at the top level
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);

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
    // Ensure menuItems is an array before filtering
    if (!Array.isArray(menuItems)) {
      console.log("menuItems is not an array in useMenuFilters", menuItems);
      return [];
    }
    
    console.log(`Filtering ${menuItems.length} items with category=${activeCategory}, excludedAllergens=${excludedAllergens.length}`);
    
    return menuItems.filter((item) => {
      // Filter by category if one is selected
      if (activeCategory && item.category !== activeCategory) {
        return false;
      }
      
      // Filter by excluded allergens
      if (excludedAllergens.length > 0 && item.allergens) {
        if (item.allergens.some(allergen => excludedAllergens.includes(allergen))) {
          return false;
        }
      }
      
      return true;
    });
  }, [menuItems, activeCategory, excludedAllergens]);

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
