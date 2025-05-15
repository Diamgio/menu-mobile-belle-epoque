
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ZoomIn, ImageOff } from "lucide-react";
import { AspectRatio } from "./ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ZoomableImageProps {
  src: string | string[]; // Updated to support both single image or array of images
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: number;
  showLoadingPlaceholder?: boolean;
}

const ZoomableImage = ({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio,
  showLoadingPlaceholder = true, // Default to true for backward compatibility
}: ZoomableImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageType, setImageType] = useState<string | null>(null);
  
  // Convert src to array if it's a string for unified handling
  const imageSources = Array.isArray(src) ? src : [src];

  // Determine if the image is a placeholder or SVG
  useEffect(() => {
    if (imageSources[0]) {
      const extension = imageSources[0].split('.').pop()?.toLowerCase();
      setImageType(extension || null);
      
      // Reset states when src changes
      setIsLoaded(false);
      setHasError(false);
    }
  }, [imageSources[0]]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    console.log(`Image loaded successfully: ${imageSources[0]}`);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    console.error(`Failed to load image: ${imageSources[0]}`);
  };

  // Show fallback for missing images
  if (!imageSources[0]) {
    return (
      <div className={cn("bg-gray-100 flex items-center justify-center", containerClassName)}>
        <ImageOff className="text-gray-400 w-8 h-8" />
        <span className="text-gray-400 ml-2">Immagine non disponibile</span>
      </div>
    );
  }

  // Enhanced placeholder detection
  const isPlaceholder = imageSources[0].includes('placeholder') || imageSources[0] === '/placeholder.svg';
  
  // Conditionally show loading placeholder based on the prop
  const imageFallback = hasError ? (
    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
      <ImageOff className="text-gray-400 w-8 h-8" />
      <span className="text-gray-400 ml-2">Immagine non disponibile</span>
    </div>
  ) : (!isLoaded && showLoadingPlaceholder) ? (
    <div className="absolute inset-0 bg-gray-100" />
  ) : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={cn("relative group cursor-zoom-in", containerClassName)}>
          {aspectRatio ? (
            <AspectRatio ratio={aspectRatio} className="overflow-hidden">
              <img
                src={imageSources[0]}
                alt={alt}
                className={cn(
                  "w-full h-full object-cover", 
                  className, 
                  !isLoaded && showLoadingPlaceholder ? "invisible" : "",
                  isPlaceholder ? "object-contain p-2" : ""
                )}
                onLoad={handleLoad}
                onError={handleError}
              />
              {imageFallback}
            </AspectRatio>
          ) : (
            <>
              <img
                src={imageSources[0]}
                alt={alt}
                className={cn(
                  "w-full h-full object-cover", 
                  className, 
                  !isLoaded && showLoadingPlaceholder ? "invisible" : "",
                  isPlaceholder ? "object-contain p-2" : ""
                )}
                onLoad={handleLoad}
                onError={handleError}
              />
              {imageFallback}
            </>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none">
        <Carousel className="w-full max-w-3xl">
          <CarouselContent>
            {imageSources.map((imageUrl, index) => (
              <CarouselItem key={index} className="flex items-center justify-center">
                <div className="relative bg-black bg-opacity-90 p-2 rounded-lg">
                  <img
                    src={imageUrl}
                    alt={`${alt} ${index + 1}`}
                    className="max-h-[80vh] w-auto object-contain mx-auto"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {imageSources.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 bg-black/50 hover:bg-black/70 text-white border-none" />
              <CarouselNext className="absolute right-2 bg-black/50 hover:bg-black/70 text-white border-none" />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default ZoomableImage;
