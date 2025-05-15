
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuItem as MenuItemType, RestaurantInfo as RestaurantInfoType } from "@/types/menu";
import { loadMenuData } from "@/services/supabaseService";
import CategoryFilter from "@/components/CategoryFilter";
import AllergenFilter from "@/components/AllergenFilter";
import MenuItem from "@/components/MenuItem";
import RestaurantInfo from "@/components/RestaurantInfo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold">Caricamento...</div>
          <p className="text-gray-500">Stiamo caricando il menu del ristorante.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold text-red-600">Errore</div>
          <p className="text-gray-500">Si è verificato un errore durante il caricamento del menu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
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
      
      {/* Admin Quick Link */}
      <div className="fixed bottom-4 right-4">
        <Link to="/admin">
          <Button 
            variant="secondary" 
            size="sm" 
            className="opacity-60 hover:opacity-100 shadow-md"
          >
            Admin
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MenuPage;
