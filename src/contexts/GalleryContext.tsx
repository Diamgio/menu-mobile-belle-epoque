
import * as React from "react";
import { MenuItem } from "@/types/menu";

interface GalleryContextType {
  items: MenuItem[];
  currentItemIndex: number;
  isOpen: boolean;
  openGallery: (items: MenuItem[], startIndex: number) => void;
  closeGallery: () => void;
  setCurrentItemIndex: (index: number) => void;
}

// Valore predefinito sicuro per il contesto
const defaultGalleryContext: GalleryContextType = {
  items: [],
  currentItemIndex: 0,
  isOpen: false,
  openGallery: () => console.warn("GalleryProvider non trovato"),
  closeGallery: () => console.warn("GalleryProvider non trovato"),
  setCurrentItemIndex: () => console.warn("GalleryProvider non trovato")
};

// Creazione del context con un valore di default
const GalleryContext = React.createContext<GalleryContextType>(defaultGalleryContext);

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  // Funzione per aprire la galleria con validazione dei parametri
  const openGallery = React.useCallback((items: MenuItem[], startIndex: number) => {
    console.log("Apertura galleria con elementi:", items?.length, "startIndex:", startIndex);
    try {
      // Verifica che items sia un array valido
      const safeItems = Array.isArray(items) ? items : [];
      // Verifica che startIndex sia valido
      const safeStartIndex = typeof startIndex === 'number' && startIndex >= 0 && startIndex < safeItems.length 
        ? startIndex 
        : 0;
      
      setItems(safeItems);
      setCurrentItemIndex(safeStartIndex);
      setIsOpen(true);
    } catch (error) {
      console.error("Errore nell'apertura della galleria:", error);
      // Imposta valori predefiniti sicuri
      setItems([]);
      setCurrentItemIndex(0);
      setIsOpen(true);
    }
  }, []);

  // Funzione per chiudere la galleria
  const closeGallery = React.useCallback(() => {
    console.log("Chiusura galleria");
    setIsOpen(false);
  }, []);

  // Memorizza il valore del contesto
  const contextValue = React.useMemo(() => ({
    items,
    currentItemIndex,
    isOpen,
    openGallery,
    closeGallery,
    setCurrentItemIndex
  }), [items, currentItemIndex, isOpen, openGallery, closeGallery]);

  return (
    <GalleryContext.Provider value={contextValue}>
      {children}
    </GalleryContext.Provider>
  );
}

// Hook per l'accesso al contesto con verifica di esistenza
export function useGallery() {
  const context = React.useContext(GalleryContext);
  // Ritorna sempre il contesto, anche se undefined (in tal caso userà il valore di default)
  return context;
}
