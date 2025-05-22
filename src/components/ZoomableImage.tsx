
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ZoomIn, ImageOff } from "lucide-react";
import { AspectRatio } from "./ui/aspect-ratio";
import { useGallery } from "@/contexts/GalleryContext";

interface ZoomableImageProps {
  src: string | string[]; 
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: number;
  showLoadingPlaceholder?: boolean;
  itemIndex?: number; // Index of the item in the menu items array
}

const ZoomableImage = ({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio,
  showLoadingPlaceholder = true,
  itemIndex = 0,
}: ZoomableImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageType, setImageType] = useState<string | null>(null);
  
  // Try to use the gallery context, but don't error if it's not available
  let galleryContext;
  try {
    galleryContext = useGallery();
  } catch (error) {
    // Context not available, will handle this case below
  }
  
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
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const handleImageClick = () => {
    // Only try to open the gallery if the context is available
    if (galleryContext) {
      // The MenuPage will inject the allItems array and this item's index using context
      // We'll pass this information to the gallery when it's opened
      const menuItems = window.__menuContext?.items || [];
      galleryContext.openGallery(menuItems, itemIndex);
    }
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
    <div 
      className={cn("relative group", galleryContext ? "cursor-zoom-in" : "", containerClassName)}
      onClick={galleryContext ? handleImageClick : undefined}
    >
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
      {galleryContext && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
          <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default ZoomableImage;
