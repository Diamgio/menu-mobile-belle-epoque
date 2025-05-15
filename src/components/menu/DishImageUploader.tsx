
import { FormLabel } from "@/components/ui/form";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ImageUploader from "@/components/ImageUploader";

interface DishImageUploaderProps {
  imageUrl: string;
  onImageUploaded: (url: string) => void;
}

const DishImageUploader = ({ imageUrl, onImageUploaded }: DishImageUploaderProps) => {
  const isPlaceholder = imageUrl === "/placeholder.svg";
  
  return (
    <div className="space-y-2">
      <FormLabel>Immagine del piatto</FormLabel>
      {!isPlaceholder ? (
        <div className="space-y-4">
          <AspectRatio ratio={4 / 3} className="bg-muted rounded-md overflow-hidden shadow-sm">
            <img
              src={imageUrl}
              alt="Immagine del piatto"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </AspectRatio>
          <ImageUploader
            onImageUploaded={onImageUploaded}
            folder="dishes"
            buttonText="Cambia immagine"
            existingImageUrl={imageUrl}
          />
        </div>
      ) : (
        <div className="touch-manipulation">
          <ImageUploader
            onImageUploaded={onImageUploaded}
            folder="dishes"
            buttonText="Carica immagine"
          />
        </div>
      )}
    </div>
  );
};

export default DishImageUploader;
