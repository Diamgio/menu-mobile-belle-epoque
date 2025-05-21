
import { useState, useEffect } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import AllergenFilter from "@/components/AllergenFilter";
import RestaurantInfo from "@/components/RestaurantInfo";
import Gallery from "@/components/Gallery";
import OfflineAlert from "@/components/OfflineAlert";
import { MenuItem as MenuItemType } from "@/types/menu";
import LoadingView from "@/components/menu/LoadingView";
import ErrorView from "@/components/menu/ErrorView";
import MenuHeader from "@/components/menu/MenuHeader";
import MenuItemsList from "@/components/menu/MenuItemsList";
import { useMenuData } from "@/hooks/useMenuData";
import { useMenuFilters } from "@/hooks/useMenuFilters";

// Define a global window object with menu context for access from other components
declare global {
  interface Window {
    __menuContext?: {
      items: MenuItemType[];
    };
  }
}

const MenuPage = () => {
  console.log("MenuPage rendering");
  
  // ALWAYS call all hooks at the top level unconditionally
  const { 
    menuItems, 
    categories, 
    allergens, 
    restaurantInfo, 
    isLoading, 
    error 
  } = useMenuData();
  
  // Ensure menuItems is never undefined for the filter hook
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];
  
  // Track a flag to ensure we properly handle any rendering errors
  const [hasRenderError, setHasRenderError] = useState(false);
  
  // Always call useMenuFilters, even if there's an error
  const { 
    activeCategory, 
    setActiveCategory, 
    excludedAllergens, 
    handleAllergenChange, 
    filteredItems 
  } = useMenuFilters(safeMenuItems);

  // Add debugging information
  useEffect(() => {
    console.log("MenuPage mounted with state:", {
      itemsCount: safeMenuItems.length,
      isLoading,
      hasError: !!error,
      filteredItemsCount: filteredItems.length,
    });
    
    // Clear any render errors on remount
    setHasRenderError(false);
  }, [safeMenuItems.length, isLoading, error, filteredItems.length]);
  
  // Category selection handler - kept outside of component body
  const handleCategorySelect = (category: string | null) => {
    console.log("Category selected:", category);
    setActiveCategory(category);
  };

  // Prepare content based on state - no early returns
  let content;
  
  if (hasRenderError || error) {
    content = <ErrorView />;
  } else if (isLoading && safeMenuItems.length === 0) {
    // Only use loading view if no data
    content = (
      <LoadingView 
        logoUrl={restaurantInfo?.logo || ""} 
        restaurantName={restaurantInfo?.name || "Caricamento..."} 
      />
    );
  } else {
    // Menu items view
    content = (
      <div className="p-4 space-y-4 container max-w-md mx-auto">
        <MenuItemsList 
          items={filteredItems}
          excludedAllergens={excludedAllergens}
          activeCategory={activeCategory}
        />
      </div>
    );
  }

  // Ensure we have valid restaurant info
  const safeRestaurantInfo = restaurantInfo || {
    name: "Caricamento...",
    openingHours: "",
    phone: "",
    address: "",
    socialLinks: {},
    logo: "/placeholder.svg"
  };

  // Safe categories and allergens
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeAllergens = Array.isArray(allergens) ? allergens : [];

  // Prepare the final rendering result
  let renderedContent;
  try {
    renderedContent = (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 relative w-full">
        <MenuHeader restaurantName={safeRestaurantInfo.name} />

        <div className="sticky top-[3.25rem] z-20 w-full">
          <CategoryFilter
            categories={safeCategories}
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {content}
        
        {/* Floating Allergen Filter Button (left side) */}
        <div className="fixed bottom-4 left-4 z-40">
          <AllergenFilter
            allergens={safeAllergens}
            excludedAllergens={excludedAllergens}
            onAllergenChange={handleAllergenChange}
            isFloating={true}
          />
        </div>
        
        {/* Floating Info Button (right side) */}
        <RestaurantInfo info={safeRestaurantInfo} floatingButton={true} />
        
        {/* Gallery component for image viewing */}
        <Gallery />
        
        {/* Offline status alert */}
        <OfflineAlert />
      </div>
    );
  } catch (e) {
    console.error("Error rendering MenuPage content:", e);
    setHasRenderError(true);
    renderedContent = <ErrorView />;
  }

  // Always return the rendered content - no conditional returns at the component level
  return renderedContent;
};

export default MenuPage;
