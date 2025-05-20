
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuItem as MenuItemType, RestaurantInfo as RestaurantInfoType } from "@/types/menu";
import { loadMenuData } from "@/services/supabaseService";
import CategoryFilter from "@/components/CategoryFilter";
import AllergenFilter from "@/components/AllergenFilter";
import MenuItem from "@/components/MenuItem";
import RestaurantInfo from "@/components/RestaurantInfo";
import ZoomableImage from "@/components/ZoomableImage";
import Gallery from "@/components/Gallery";

// Define a global window object with menu context for access from other components
declare global {
  interface Window {
    __menuContext?: {
      items: MenuItemType[];
    };
  }
}

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
    socialLinks: {},
    logo: "/placeholder.svg"
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
      
      // Make menu items available globally for the ZoomableImage component
      window.__menuContext = {
        items: data.menuItems
      };
      
      console.log("Menu data loaded:", { 
        itemsCount: data.menuItems.length,
        categories: data.categories,
        allergens: data.allergens
      });
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
    
    // Filter by excluded allergens
    if (excludedAllergens.length > 0) {
      if (item.allergens?.some(allergen => excludedAllergens.includes(allergen))) {
        return false;
      }
    }
    
    return true;
  });

  const handleCategorySelect = (category: string | null) => {
    console.log("Category selected:", category);
    setActiveCategory(category);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
        <div className="mb-8 w-32 h-32 relative">
          <ZoomableImage
            src={restaurantInfo.logo}
            alt={restaurantInfo.name}
            aspectRatio={1}
            showLoadingPlaceholder={false}
          />
        </div>
        <div className="text-center px-4">
          <div className="mb-4 text-3xl font-bold dark:text-white">Caricamento...</div>
          <p className="text-gray-500 dark:text-gray-400">Stiamo caricando il menu del ristorante.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
        <div className="text-center px-4">
          <div className="mb-4 text-3xl font-bold text-red-600">Errore</div>
          <p className="text-gray-500 dark:text-gray-400">Si è verificato un errore durante il caricamento del menu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 relative w-full">
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm w-full">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <h1 className="text-xl font-bold dark:text-white">{restaurantInfo.name}</h1>
        </div>
      </div>

      <div className="sticky top-[3.25rem] z-20 w-full">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      <div className="p-4 space-y-4 container max-w-md mx-auto">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <MenuItem
              key={item.id}
              item={item}
              excludedAllergens={excludedAllergens}
              itemIndex={index}
            />
          ))
        ) : (
          <div className="mt-8 text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              {activeCategory 
                ? `Nessun piatto trovato nella categoria "${activeCategory}"`
                : "Nessun piatto trovato con i filtri selezionati"}
            </p>
            {excludedAllergens.length > 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Hai escluso {excludedAllergens.length} allergeni
              </p>
            )}
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
      
      {/* Gallery component for image viewing */}
      <Gallery />
    </div>
  );
};

export default MenuPage;
