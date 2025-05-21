
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
  const { 
    menuItems, 
    categories, 
    allergens, 
    restaurantInfo, 
    isLoading, 
    error 
  } = useMenuData();

  const { 
    activeCategory, 
    setActiveCategory, 
    excludedAllergens, 
    handleAllergenChange, 
    filteredItems 
  } = useMenuFilters(menuItems);

  const handleCategorySelect = (category: string | null) => {
    console.log("Category selected:", category);
    setActiveCategory(category);
  };

  // Create content elements based on loading state WITHOUT early returns
  const getContentElement = () => {
    if (isLoading && menuItems.length === 0) {
      return (
        <LoadingView 
          logoUrl={restaurantInfo.logo} 
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

  // Main render - no early returns, all hooks called unconditionally
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

      {getContentElement()}
      
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
