
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
  // All hooks are called unconditionally at the top level
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);

  const handleAllergenChange = (allergen: string) => {
    setExcludedAllergens((current) =>
      current.includes(allergen)
        ? current.filter((a) => a !== allergen)
        : [...current, allergen]
    );
  };

  // Using useMemo for filtering logic - avoids recalculations on every render
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Filter by category if one is selected
      if (activeCategory && item.category !== activeCategory) {
        return false;
      }
      
      // Filter by excluded allergens
      if (excludedAllergens.length > 0) {
        if (item.allergens?.some(allergen => excludedAllergens.includes(allergen))) {
          return false;
        }
      }
      
      return true;
    });
  }, [menuItems, activeCategory, excludedAllergens]);

  // All hooks are called every time - no conditions
  return {
    activeCategory,
    setActiveCategory,
    excludedAllergens,
    handleAllergenChange,
    filteredItems
  };
};
