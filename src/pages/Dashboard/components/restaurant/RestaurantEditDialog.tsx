
import { RestaurantInfo } from "@/types/menu";
import RestaurantInfoForm from "@/components/RestaurantInfoForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RestaurantEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantInfo: RestaurantInfo;
  onSave: (info: RestaurantInfo) => void;
  onCancel: () => void;
}

const RestaurantEditDialog = ({
  isOpen,
  onOpenChange,
  restaurantInfo,
  onSave,
  onCancel,
}: RestaurantEditDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifica Informazioni</DialogTitle>
          <DialogDescription>
            Aggiorna le informazioni del ristorante
          </DialogDescription>
        </DialogHeader>
        <RestaurantInfoForm
          info={restaurantInfo}
          onSave={onSave}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantEditDialog;
