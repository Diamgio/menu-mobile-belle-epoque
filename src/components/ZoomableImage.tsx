
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
  // SEMPRE chiama tutti gli hooks in modo incondizionato all'inizio
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageType, setImageType] = useState<string | null>(null);
  const [isGalleryEnabled, setIsGalleryEnabled] = useState(false);
  
  // Sempre chiama il hook in modo incondizionato all'inizio
  const gallery = useGallery();
  
  // Converti src in array se è una stringa per una gestione unificata
  const imageSources = Array.isArray(src) ? src : [src];

  // Controlla se la funzionalità della galleria è disponibile dopo il montaggio del componente
  useEffect(() => {
    // Verifica che gallery esista e che la funzione openGallery sia disponibile
    setIsGalleryEnabled(!!gallery && typeof gallery.openGallery === 'function');
  }, [gallery]);
  
  // Determina se l'immagine è un placeholder o SVG
  useEffect(() => {
    if (imageSources[0]) {
      const extension = imageSources[0].split('.').pop()?.toLowerCase();
      setImageType(extension || null);
      
      // Reset degli stati quando src cambia
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
    // Prova ad aprire la galleria solo se è abilitata e l'oggetto gallery esiste
    if (isGalleryEnabled && gallery && typeof gallery.openGallery === 'function') {
      try {
        // MenuPage inietterà l'array allItems e l'indice di questo elemento usando il contesto
        const menuItems = window.__menuContext?.items || [];
        gallery.openGallery(menuItems, itemIndex);
      } catch (error) {
        console.error("Errore nell'apertura della galleria:", error);
      }
    }
  };

  // Prepara variabili che verranno utilizzate nella renderizzazione
  let content;
  
  // Mostra fallback per immagini mancanti
  if (!imageSources[0]) {
    content = (
      <div className={cn("bg-gray-100 flex items-center justify-center", containerClassName)}>
        <ImageOff className="text-gray-400 w-8 h-8" />
        <span className="text-gray-400 ml-2">Immagine non disponibile</span>
      </div>
    );
  } else {
    // Rilevamento migliorato del placeholder
    const isPlaceholder = imageSources[0].includes('placeholder') || imageSources[0] === '/placeholder.svg';
    
    // Mostra il placeholder di caricamento in base al prop
    const imageFallback = hasError ? (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <ImageOff className="text-gray-400 w-8 h-8" />
        <span className="text-gray-400 ml-2">Immagine non disponibile</span>
      </div>
    ) : (!isLoaded && showLoadingPlaceholder) ? (
      <div className="absolute inset-0 bg-gray-100" />
    ) : null;

    content = (
      <div 
        className={cn("relative group", isGalleryEnabled ? "cursor-zoom-in" : "", containerClassName)}
        onClick={isGalleryEnabled ? handleImageClick : undefined}
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
        {isGalleryEnabled && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg" />
          </div>
        )}
      </div>
    );
  }

  return content;
};

export default ZoomableImage;
