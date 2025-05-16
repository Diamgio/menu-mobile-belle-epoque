
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
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Define a global window object with menu context for access from other components
declare global {
  interface Window {
    __menuContext?: {
      items: MenuItemType[];
    };
  }
}

interface MenuPageProps {
  restaurantId?: number;
}

const MenuPage = ({ restaurantId }: MenuPageProps) => {
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
  
  // Get the subdomain from URL parameters
  const { subdomain } = useParams<{ subdomain: string }>();
  const [fetchedRestaurantId, setFetchedRestaurantId] = useState<number | null>(null);
  
  // Fetch restaurant ID if not provided
  useEffect(() => {
    const fetchRestaurantId = async () => {
      if (!restaurantId && subdomain) {
        try {
          const { data, error } = await supabase
            .from('restaurants')
            .select('id')
            .eq('subdomain', subdomain)
            .single();
          
          if (error) {
            console.error('Error fetching restaurant:', error);
          } else {
            setFetchedRestaurantId(data.id);
          }
        } catch (error) {
          console.error('Error fetching restaurant:', error);
        }
      }
    };
    
    fetchRestaurantId();
  }, [restaurantId, subdomain]);
  
  // Use the provided restaurant ID or the fetched one
  const effectiveRestaurantId = restaurantId || fetchedRestaurantId;
  
  // Fetch menu data from Supabase
  const { data, isLoading, error } = useQuery({
    queryKey: ['menuData', effectiveRestaurantId],
    queryFn: () => loadMenuData(effectiveRestaurantId),
    enabled: !!effectiveRestaurantId,
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

  if (isLoading || (!data && effectiveRestaurantId)) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="mb-8 w-32 h-32 relative">
          <ZoomableImage
            src={restaurantInfo.logo}
            alt={restaurantInfo.name}
            aspectRatio={1}
            showLoadingPlaceholder={false}
          />
        </div>
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold dark:text-white">Caricamento...</div>
          <p className="text-gray-500 dark:text-gray-400">Stiamo caricando il menu del ristorante.</p>
        </div>
      </div>
    );
  }

  if (error || (!data && !isLoading)) {
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
        {filteredItems.map((item, index) => (
          <MenuItem
            key={item.id}
            item={item}
            excludedAllergens={excludedAllergens}
            itemIndex={index}
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
      
      {/* Gallery component for image viewing */}
      <Gallery />
    </div>
  );
};

export default MenuPage;
