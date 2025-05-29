import * as React from "react";
import { useGallery } from "@/contexts/GalleryContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "./ui/aspect-ratio";
import { X } from "lucide-react";

const Gallery = () => {
  const { items, isOpen, closeGallery, currentItemIndex, setCurrentItemIndex } = useGallery();
  const [carouselApi, setCarouselApi] = React.useState<any>(null);

  // When the gallery opens, set the carousel to the correct index
  React.useEffect(() => {
    if (carouselApi && isOpen) {
      carouselApi.scrollTo(currentItemIndex);
    }
  }, [carouselApi, isOpen, currentItemIndex]);

  // Update the current index when the carousel changes
  React.useEffect(() => {
    if (!carouselApi) return;
    
    const onSelect = () => {
      setCurrentItemIndex(carouselApi.selectedScrollSnap());
    };
    
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi, setCurrentItemIndex]);

  // Get all image sources from all items
  const allImages = React.useMemo(() => {
    return items.flatMap(item => {
      const images = item.images || (item.image ? [item.image] : []);
      return images.length > 0 ? images : ["/placeholder.svg"];
    });
  }, [items]);

  if (allImages.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeGallery()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
        <button 
          className="absolute right-4 top-4 z-50 text-white bg-black/50 rounded-full p-2"
          onClick={closeGallery}
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-4 text-white">
          <DialogTitle className="text-xl font-bold mb-1">{items[currentItemIndex]?.name}</DialogTitle>
          <p className="text-sm opacity-80">{items[currentItemIndex]?.description}</p>
        </div>
        
        <Carousel 
          className="w-full" 
          setApi={setCarouselApi}
        >
          <CarouselContent>
            {allImages.map((src, index) => (
              <CarouselItem key={index} className="flex items-center justify-center">
                <AspectRatio ratio={4/3} className="bg-black w-full max-w-3xl mx-auto">
                  <img
                    src={src}
                    alt={`Immagine ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          {allImages.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-4 bg-black/50 hover:bg-black/70 text-white border-none" />
              <CarouselNext className="absolute right-4 bg-black/50 hover:bg-black/70 text-white border-none" />
            </>
          )}
        </Carousel>
        
        <div className="p-4 text-white text-center">
          <p className="text-sm">
            {currentItemIndex + 1} di {allImages.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Gallery;