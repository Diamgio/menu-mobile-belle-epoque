
import React from "react";
import { MenuItem as MenuItemType } from "@/types/menu";
import MenuItem from "@/components/MenuItem";

interface MenuItemsListProps {
  items: MenuItemType[];
  excludedAllergens: string[];
  activeCategory: string | null;
}

const MenuItemsList = ({ items, excludedAllergens, activeCategory }: MenuItemsListProps) => {
  if (items.length === 0) {
    return (
      <div className="mt-8 text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {activeCategory 
            ? `Nessun piatto trovato nella categoria "${activeCategory}"`
            : "Nessun piatto trovato con i filtri selezionati"}
        </p>
        {excludedAllergens.length > 0 && (
          <p className="text-base text-gray-400 dark:text-gray-500 mt-2">
            Hai escluso {excludedAllergens.length} allergeni
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      {items.map((item, index) => (
        <MenuItem
          key={item.id}
          item={item}
          excludedAllergens={excludedAllergens}
          itemIndex={index}
        />
      ))}
    </>
  );
};

export default MenuItemsList;
