
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ImagePlus } from "lucide-react";

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  folder?: string;
  buttonText?: string;
  className?: string;
  existingImageUrl?: string;
}

const ImageUploader = ({
  onImageUploaded,
  folder = "general",
  buttonText = "Carica immagine",
  className = "",
  existingImageUrl
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const bucketName = "belleepoque";

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Controllo del tipo e dimensione del file
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipo di file non valido",
        description: "Per favore carica un'immagine",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File troppo grande",
        description: "L'immagine deve essere inferiore a 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generiamo un nome file univoco
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Se c'è già un'immagine esistente, proviamo a rimuoverla
      if (existingImageUrl) {
        const existingPath = existingImageUrl.replace(
          `https://bhgsvlplsxnpqqbxsxzq.supabase.co/storage/v1/object/public/${bucketName}/`,
          ""
        );
        
        if (existingPath.startsWith(folder)) {
          await supabase.storage.from(bucketName).remove([existingPath]);
        }
      }

      // Carichiamo la nuova immagine
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Generiamo l'URL pubblico
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onImageUploaded(publicUrlData.publicUrl);
      
      toast({
        title: "Immagine caricata",
        description: "L'immagine è stata caricata con successo",
      });
    } catch (error: any) {
      console.error("Errore durante l'upload:", error);
      toast({
        title: "Errore durante il caricamento",
        description: error.message || "Si è verificato un errore durante il caricamento dell'immagine",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`${className}`}>
      <label>
        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          className="hidden"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          disabled={isUploading}
          asChild
        >
          <span>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Caricamento...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                {buttonText}
              </>
            )}
          </span>
        </Button>
      </label>
    </div>
  );
};

export default ImageUploader;
