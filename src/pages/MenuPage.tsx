
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

// Definisci un oggetto window globale con il contesto del menu per l'accesso da altri componenti
declare global {
  interface Window {
    __menuContext?: {
      items: MenuItemType[];
    };
  }
}

const MenuPage = () => {
  console.log("MenuPage rendering");
  
  // SEMPRE chiamiamo tutti gli hooks all'inizio in modo incondizionato
  const { 
    menuItems, 
    categories, 
    allergens, 
    restaurantInfo, 
    isLoading, 
    error 
  } = useMenuData();
  
  // Inizializzazione sicura di window.__menuContext
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Inizializziamo sempre l'oggetto context
      window.__menuContext = window.__menuContext || { items: [] };
      
      // Aggiorniamo il contesto solo se abbiamo menuItems validi
      if (Array.isArray(menuItems) && menuItems.length > 0) {
        window.__menuContext.items = menuItems;
        console.log("Menu context aggiornato con elementi:", menuItems.length);
      }
    }
    
    return () => {
      // Pulizia sicura al unmount
      if (typeof window !== 'undefined' && window.__menuContext) {
        console.log("Pulizia menu context");
      }
    };
  }, [menuItems]);
  
  // Assicurazione che menuItems non sia mai undefined
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];
  
  // Teniamo traccia di eventuali errori di rendering
  const [hasRenderError, setHasRenderError] = useState(false);
  
  // Chiamiamo SEMPRE useMenuFilters indipendentemente dagli errori
  const { 
    activeCategory, 
    setActiveCategory, 
    excludedAllergens, 
    handleAllergenChange, 
    filteredItems 
  } = useMenuFilters(safeMenuItems);

  // Debug info
  useEffect(() => {
    console.log("MenuPage montata con stato:", {
      itemsCount: safeMenuItems.length,
      isLoading,
      hasError: !!error,
      filteredItemsCount: filteredItems.length,
    });
    
    // Reset degli errori di rendering al montaggio
    setHasRenderError(false);
  }, [safeMenuItems, isLoading, error, filteredItems.length]);
  
  // Gestiamo la selezione della categoria
  const handleCategorySelect = (category: string | null) => {
    console.log("Categoria selezionata:", category);
    setActiveCategory(category);
  };

  // Prepariamo il contenuto in base allo stato - NESSUN RETURN anticipato
  let content;
  
  if (hasRenderError || error) {
    content = <ErrorView />;
  } else if (isLoading && safeMenuItems.length === 0) {
    content = (
      <LoadingView 
        logoUrl={restaurantInfo?.logo || ""} 
        restaurantName={restaurantInfo?.name || "Caricamento..."} 
      />
    );
  } else {
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

  // Informazioni sicure sul ristorante
  const safeRestaurantInfo = restaurantInfo || {
    name: "Caricamento...",
    openingHours: "",
    phone: "",
    address: "",
    socialLinks: {},
    logo: "/placeholder.svg"
  };

  // Categorie e allergeni sicuri
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeAllergens = Array.isArray(allergens) ? allergens : [];

  // UN SOLO RETURN alla fine con try/catch per protezione
  try {
    return (
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
        
        {/* Pulsante Filtro Allergeni fluttuante */}
        <div className="fixed bottom-4 left-4 z-40">
          <AllergenFilter
            allergens={safeAllergens}
            excludedAllergens={excludedAllergens}
            onAllergenChange={handleAllergenChange}
            isFloating={true}
          />
        </div>
        
        {/* Info ristorante fluttuante */}
        <RestaurantInfo info={safeRestaurantInfo} floatingButton={true} />
        
        {/* Galleria immagini */}
        <Gallery />
        
        {/* Avviso offline */}
        <OfflineAlert />
      </div>
    );
  } catch (e) {
    console.error("Errore nel rendering di MenuPage:", e);
    setHasRenderError(true);
    return <ErrorView />;
  }
};

export default MenuPage;
