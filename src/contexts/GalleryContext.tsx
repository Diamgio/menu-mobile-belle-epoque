
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

const GalleryContext = React.createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const openGallery = (items: MenuItem[], startIndex: number) => {
    setItems(items);
    setCurrentItemIndex(startIndex);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  return (
    <GalleryContext.Provider
      value={{
        items,
        currentItemIndex,
        isOpen,
        openGallery,
        closeGallery,
        setCurrentItemIndex
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = React.useContext(GalleryContext);
  if (context === undefined) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
}
