
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

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
  const [api, setApi] = useState<CarouselApi | null>(null);
  
  // When active category changes, scroll to it
  useEffect(() => {
    if (!api || activeCategory === null) return;
    
    // Find the index of the active category
    const index = categories.indexOf(activeCategory);
    if (index !== -1) {
      // Add 1 because the "Tutti" button is at index 0
      api.scrollTo(index + 1);
    }
  }, [activeCategory, categories, api]);

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 pb-2 shadow-sm">
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="px-4 py-3 -ml-4">
          <CarouselItem className="pl-4 basis-auto">
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
          </CarouselItem>
          
          {categories.map((category) => (
            <CarouselItem className="pl-4 basis-auto" key={category}>
              <button
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
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CategoryFilter;
