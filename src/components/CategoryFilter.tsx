
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  
  // When active category changes, scroll to it
  useEffect(() => {
    if (!api || activeCategory === null) return;
    
    // Find the index of the active category
    const index = categories.indexOf(activeCategory);
    if (index !== -1) {
      // Add 1 because the "Tutti" button is at index 0
      api.scrollTo(index + 1);
      console.log(`Scrolling to category at index ${index + 1}: ${activeCategory}`);
    }
  }, [activeCategory, categories, api]);

  // Monitor scroll capabilities
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      console.log(`Scroll capabilities: prev=${api.canScrollPrev()}, next=${api.canScrollNext()}`);
    };
    
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    
    // Initial check
    onSelect();
    
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 pb-2 shadow-sm">
      <div className="relative px-2 w-full max-w-md mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
            containScroll: "trimSnaps",
          }}
          onApiChange={setApi}
          className="w-full relative"
        >
          <CarouselContent className="px-2 py-3">
            <CarouselItem className="basis-auto pl-2">
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
              <CarouselItem className="basis-auto pl-2" key={category}>
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
          
          {/* Show navigation buttons only when scrolling is possible */}
          {canScrollPrev && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => api?.scrollPrev()} 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md dark:bg-gray-800/80"
                aria-label="Scorri a sinistra"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {canScrollNext && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => api?.scrollNext()} 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md dark:bg-gray-800/80"
                aria-label="Scorri a destra"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </Carousel>
        
        {/* Visual indicator for horizontal scrolling */}
        <div className="hidden sm:flex justify-center mt-1">
          <div className="h-1 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ 
                width: api ? `${Math.min(100, (api.scrollProgress() || 0) * 100)}%` : "0%" 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
