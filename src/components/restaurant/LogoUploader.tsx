
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ImageUploader from "@/components/ImageUploader";

interface LogoUploaderProps {
  logoUrl: string;
  onLogoUploaded: (url: string) => void;
}

const LogoUploader = ({ logoUrl, onLogoUploaded }: LogoUploaderProps) => {
  return (
    <div className="space-y-2">
      <FormLabel>Logo del ristorante</FormLabel>
      {logoUrl ? (
        <div className="space-y-4">
          <AspectRatio ratio={1 / 1} className="bg-muted rounded-md overflow-hidden">
            <img
              src={logoUrl}
              alt="Logo del ristorante"
              className="w-full h-full object-contain"
            />
          </AspectRatio>
          <ImageUploader
            onImageUploaded={onLogoUploaded}
            folder="logos"
            buttonText="Cambia logo"
            existingImageUrl={logoUrl}
          />
        </div>
      ) : (
        <ImageUploader
          onImageUploaded={onLogoUploaded}
          folder="logos"
          buttonText="Carica logo"
        />
      )}
    </div>
  );
};

export default LogoUploader;
