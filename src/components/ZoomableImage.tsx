
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ZoomIn, ImageOff } from "lucide-react";
import { AspectRatio } from "./ui/aspect-ratio";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: number;
}

const ZoomableImage = ({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio,
}: ZoomableImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageType, setImageType] = useState<string | null>(null);

  // Determine if the image is a placeholder or SVG
  useEffect(() => {
    if (src) {
      const extension = src.split('.').pop()?.toLowerCase();
      setImageType(extension || null);
      
      // Reset states when src changes
      setIsLoaded(false);
      setHasError(false);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    console.log(`Image loaded successfully: ${src}`);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    console.error(`Failed to load image: ${src}`);
  };

  // Show fallback for missing images
  if (!src) {
    return (
      <div className={cn("bg-gray-100 flex items-center justify-center", containerClassName)}>
        <ImageOff className="text-gray-400 w-8 h-8" />
        <span className="text-gray-400 ml-2">Immagine non disponibile</span>
      </div>
    );
  }

  // Enhanced placeholder detection
  const isPlaceholder = src.includes('placeholder') || src === '/placeholder.svg';
  
  // Don't use animation for placeholders or when the no-animation class is present
  const shouldAnimate = !isPlaceholder && !containerClassName?.includes('no-animation');
  
  const imageFallback = hasError ? (
    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
      <ImageOff className="text-gray-400 w-8 h-8" />
      <span className="text-gray-400 ml-2">Immagine non disponibile</span>
    </div>
  ) : !isLoaded && shouldAnimate ? (
    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
  ) : !isLoaded ? (
    <div className="absolute inset-0 bg-gray-100" />
  ) : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={cn("relative group cursor-zoom-in", containerClassName)}>
          {aspectRatio ? (
            <AspectRatio ratio={aspectRatio} className="overflow-hidden">
              <img
                src={src}
                alt={alt}
                className={cn(
                  "w-full h-full object-cover", 
                  className, 
                  !isLoaded ? "invisible" : "",
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
                src={src}
                alt={alt}
                className={cn(
                  "w-full h-full object-cover", 
                  className, 
                  !isLoaded ? "invisible" : "",
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
        <div className="relative">
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] max-w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZoomableImage;
