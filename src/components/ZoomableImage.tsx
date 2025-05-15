
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ZoomIn } from "lucide-react";
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

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  if (!src) {
    return (
      <div className={cn("bg-gray-100 flex items-center justify-center", containerClassName)}>
        <span className="text-gray-400">Immagine non disponibile</span>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={cn("relative group cursor-zoom-in", containerClassName)}>
          {aspectRatio ? (
            <AspectRatio ratio={aspectRatio} className="overflow-hidden">
              <img
                src={src}
                alt={alt}
                className={cn("w-full h-full object-cover", className, !isLoaded ? "invisible" : "")}
                onLoad={handleLoad}
                onError={handleError}
              />
              {!isLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
              {hasError && <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Immagine non disponibile</span>
              </div>}
            </AspectRatio>
          ) : (
            <>
              <img
                src={src}
                alt={alt}
                className={cn("w-full h-full object-cover", className, !isLoaded ? "invisible" : "")}
                onLoad={handleLoad}
                onError={handleError}
              />
              {!isLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
              {hasError && <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Immagine non disponibile</span>
              </div>}
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
