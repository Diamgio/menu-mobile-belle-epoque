
import { useState } from "react";
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
  // Always call all hooks at the top level of your component
  console.log("MenuPage rendering");
  
  const { 
    menuItems, 
    categories, 
    allergens, 
    restaurantInfo, 
    isLoading, 
    error 
  } = useMenuData();

  console.log("useMenuData hook result:", { menuItemsCount: menuItems.length, isLoading, error });

  const { 
    activeCategory, 
    setActiveCategory, 
    excludedAllergens, 
    handleAllergenChange, 
    filteredItems 
  } = useMenuFilters(menuItems);

  console.log("useMenuFilters hook result:", {
    activeCategory,
    excludedAllergens,
    filteredItemsCount: filteredItems.length
  });

  const handleCategorySelect = (category: string | null) => {
    console.log("Category selected:", category);
    setActiveCategory(category);
  };

  // Move conditional rendering logic to a separate function to avoid breaking hook rules
  const renderContent = () => {
    if (isLoading && menuItems.length === 0) {
      return (
        <LoadingView 
          logoUrl={restaurantInfo.logo || ""} 
          restaurantName={restaurantInfo.name} 
        />
      );
    }

    if (error) {
      return <ErrorView />;
    }

    return (
      <div className="p-4 space-y-4 container max-w-md mx-auto">
        <MenuItemsList 
          items={filteredItems}
          excludedAllergens={excludedAllergens}
          activeCategory={activeCategory}
        />
      </div>
    );
  };

  // Main render - always returns the same structure
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 relative w-full">
      <MenuHeader restaurantName={restaurantInfo.name} />

      <div className="sticky top-[3.25rem] z-20 w-full">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      {renderContent()}
      
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
      
      {/* Offline status alert */}
      <OfflineAlert />
    </div>
  );
};

export default MenuPage;
