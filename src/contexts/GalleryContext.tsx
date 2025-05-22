
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

// Create a default context value to avoid null checks
const defaultGalleryContext: GalleryContextType = {
  items: [],
  currentItemIndex: 0,
  isOpen: false,
  openGallery: () => console.warn("GalleryProvider not found"),
  closeGallery: () => console.warn("GalleryProvider not found"),
  setCurrentItemIndex: () => console.warn("GalleryProvider not found")
};

const GalleryContext = React.createContext<GalleryContextType>(defaultGalleryContext);

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const openGallery = React.useCallback((items: MenuItem[], startIndex: number) => {
    console.log("Opening gallery with items:", items.length, "startIndex:", startIndex);
    // Ensure items is an array
    const safeItems = Array.isArray(items) ? items : [];
    // Ensure startIndex is valid
    const safeStartIndex = startIndex >= 0 && startIndex < safeItems.length ? startIndex : 0;
    
    setItems(safeItems);
    setCurrentItemIndex(safeStartIndex);
    setIsOpen(true);
  }, []);

  const closeGallery = React.useCallback(() => {
    console.log("Closing gallery");
    setIsOpen(false);
  }, []);

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

export function useGallery() {
  const context = React.useContext(GalleryContext);
  return context;
}
