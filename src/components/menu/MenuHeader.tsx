
import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MenuHeaderProps {
  restaurantName: string;
}

const MenuHeader = ({ restaurantName }: MenuHeaderProps) => {
  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm w-full">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div></div>
        <h1 className="text-xl font-bold dark:text-white">{restaurantName}</h1>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default MenuHeader;
