
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter = ({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="overflow-x-auto scrollbar-hide sticky top-0 z-20 bg-white pb-2 shadow-sm">
      <div className="flex space-x-2 px-4 py-3">
        <button
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeCategory === null
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          onClick={() => onSelectCategory(null)}
        >
          Tutti
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === category
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
