
import { useState } from "react";
import { menuItems, categories, allergens, restaurantInfo } from "@/data/menuData";
import CategoryFilter from "@/components/CategoryFilter";
import AllergenFilter from "@/components/AllergenFilter";
import MenuItem from "@/components/MenuItem";
import RestaurantInfo from "@/components/RestaurantInfo";

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);

  const handleAllergenChange = (allergen: string) => {
    setExcludedAllergens((current) =>
      current.includes(allergen)
        ? current.filter((a) => a !== allergen)
        : [...current, allergen]
    );
  };

  const filteredItems = menuItems.filter((item) => {
    // Filter by category if one is selected
    if (activeCategory && item.category !== activeCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-30 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{restaurantInfo.name}</h1>
          <div className="flex items-center space-x-2">
            <AllergenFilter
              allergens={allergens}
              excludedAllergens={excludedAllergens}
              onAllergenChange={handleAllergenChange}
            />
            <RestaurantInfo info={restaurantInfo} />
          </div>
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <div className="p-4 space-y-4">
        {filteredItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            excludedAllergens={excludedAllergens}
          />
        ))}

        {filteredItems.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500">Nessun piatto trovato</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
