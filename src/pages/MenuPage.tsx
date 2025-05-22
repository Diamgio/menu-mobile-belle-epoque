
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
  
  // SEMPRE chiama tutti gli hooks all'inizio in modo incondizionato
  const { 
    menuItems, 
    categories, 
    allergens, 
    restaurantInfo, 
    isLoading, 
    error 
  } = useMenuData();
  
  // Inizializza window.__menuContext per evitare errori undefined
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Inizializza sempre l'oggetto di contesto
      window.__menuContext = window.__menuContext || { items: [] };
      
      // Aggiorna il contesto del menu se abbiamo elementi di menu
      if (Array.isArray(menuItems) && menuItems.length > 0) {
        window.__menuContext.items = menuItems;
        console.log("Menu context aggiornato con elementi:", menuItems.length);
      }
    }
  }, [menuItems]);
  
  // Assicura che menuItems non sia mai undefined per l'hook di filtro
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];
  
  // Tieni traccia di un flag per assicurarti di gestire correttamente eventuali errori di rendering
  const [hasRenderError, setHasRenderError] = useState(false);
  
  // Chiama sempre useMenuFilters, anche se c'è un errore
  const { 
    activeCategory, 
    setActiveCategory, 
    excludedAllergens, 
    handleAllergenChange, 
    filteredItems 
  } = useMenuFilters(safeMenuItems);

  // Aggiungi informazioni di debug
  useEffect(() => {
    console.log("MenuPage montata con stato:", {
      itemsCount: safeMenuItems.length,
      isLoading,
      hasError: !!error,
      filteredItemsCount: filteredItems.length,
    });
    
    // Cancella eventuali errori di rendering al rimontaggio
    setHasRenderError(false);
  }, [safeMenuItems, isLoading, error, filteredItems.length]);
  
  // Gestore della selezione della categoria - mantenuto fuori dal corpo del componente
  const handleCategorySelect = (category: string | null) => {
    console.log("Categoria selezionata:", category);
    setActiveCategory(category);
  };

  // Prepara il contenuto in base allo stato - nessun return anticipato
  let content;
  
  if (hasRenderError || error) {
    content = <ErrorView />;
  } else if (isLoading && safeMenuItems.length === 0) {
    // Usa la vista di caricamento solo se non ci sono dati
    content = (
      <LoadingView 
        logoUrl={restaurantInfo?.logo || ""} 
        restaurantName={restaurantInfo?.name || "Caricamento..."} 
      />
    );
  } else {
    // Vista degli elementi del menu
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

  // Assicurati di avere informazioni sul ristorante valide
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

  // Prepara il risultato finale del rendering
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
        
        {/* Pulsante Filtro Allergeni fluttuante (lato sinistro) */}
        <div className="fixed bottom-4 left-4 z-40">
          <AllergenFilter
            allergens={safeAllergens}
            excludedAllergens={excludedAllergens}
            onAllergenChange={handleAllergenChange}
            isFloating={true}
          />
        </div>
        
        {/* Pulsante Info fluttuante (lato destro) */}
        <RestaurantInfo info={safeRestaurantInfo} floatingButton={true} />
        
        {/* Componente Gallery per la visualizzazione delle immagini */}
        <Gallery />
        
        {/* Avviso stato offline */}
        <OfflineAlert />
      </div>
    );
  } catch (e) {
    console.error("Errore nel rendering del contenuto di MenuPage:", e);
    setHasRenderError(true);
    return <ErrorView />;
  }
};

export default MenuPage;
