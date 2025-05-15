
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  // State for horizontal scrolling control
  const [scrollPosition, setScrollPosition] = useState(0);

  // Scroll to active category when it changes
  useEffect(() => {
    if (activeCategory) {
      const activeElement = document.getElementById(`category-${activeCategory}`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory, categories]);

  return (
    <div className="overflow-x-auto scrollbar-hide sticky top-0 z-20 bg-white dark:bg-gray-800 pb-2 shadow-sm">
      <div className="flex space-x-2 px-4 py-3">
        <button
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeCategory === null
              ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          )}
          onClick={() => onSelectCategory(null)}
        >
          Tutti
        </button>
        {categories.map((category) => (
          <button
            id={`category-${category}`}
            key={category}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === category
                ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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
