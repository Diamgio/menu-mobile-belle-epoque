
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuItem as MenuItemType, RestaurantInfo as RestaurantInfoType } from "@/types/menu";
import { loadMenuData } from "@/services/supabaseService";
import CategoryFilter from "@/components/CategoryFilter";
import AllergenFilter from "@/components/AllergenFilter";
import MenuItem from "@/components/MenuItem";
import RestaurantInfo from "@/components/RestaurantInfo";

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfoType>({
    name: "Caricamento...",
    openingHours: "",
    phone: "",
    address: "",
    socialLinks: {}
  });
  
  // Fetch menu data from Supabase
  const { data, isLoading, error } = useQuery({
    queryKey: ['menuData'],
    queryFn: loadMenuData
  });
  
  useEffect(() => {
    if (data) {
      setMenuItems(data.menuItems);
      setCategories(data.categories);
      setAllergens(data.allergens);
      setRestaurantInfo(data.restaurantInfo);
    }
  }, [data]);

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold dark:text-white">Caricamento...</div>
          <p className="text-gray-500 dark:text-gray-400">Stiamo caricando il menu del ristorante.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold text-red-600">Errore</div>
          <p className="text-gray-500 dark:text-gray-400">Si è verificato un errore durante il caricamento del menu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 relative">
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold dark:text-white">{restaurantInfo.name}</h1>
        </div>
      </div>

      <div className="sticky top-[3.25rem] z-20 bg-white dark:bg-gray-800 shadow-sm px-2">
        <div className="flex items-center justify-between py-2">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>
      </div>

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
            <p className="text-gray-500 dark:text-gray-400">Nessun piatto trovato</p>
          </div>
        )}
      </div>
      
      {/* Floating Allergen Filter Button (left side) */}
      <div className="fixed bottom-4 left-4 z-40">
        <AllergenFilter
          allergens={allergens}
          excludedAllergens={excludedAllergens}
          onAllergenChange={handleAllergenChange}
          isFloating={true}
        />
      </div>
      
      {/* Floating Info Button (right side) */}
      <RestaurantInfo info={restaurantInfo} floatingButton={true} />
    </div>
  );
};

export default MenuPage;
