
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);

  const handleAllergenChange = (allergen: string) => {
    setExcludedAllergens((current) =>
      current.includes(allergen)
        ? current.filter((a) => a !== allergen)
        : [...current, allergen]
    );
  };

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

  return {
    activeCategory,
    setActiveCategory,
    excludedAllergens,
    handleAllergenChange,
    filteredItems
  };
};
