
import { useState } from "react";
import { RestaurantInfo } from "@/types/menu";
import { useRestaurantInfoMutation } from "../hooks/useRestaurantInfoMutation";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import RestaurantDetails from "./restaurant/RestaurantDetails";
import RestaurantEditDialog from "./restaurant/RestaurantEditDialog";

interface RestaurantInfoManagementProps {
  restaurantInfo: RestaurantInfo;
}

const RestaurantInfoManagement = ({ restaurantInfo }: RestaurantInfoManagementProps) => {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const { toast } = useToast();
  const { updateInfoMutation } = useRestaurantInfoMutation();

  const handleUpdateInfo = (info: RestaurantInfo) => {
    updateInfoMutation.mutate(info, {
      onSuccess: () => {
        setIsInfoDialogOpen(false);
        toast({
          title: "Informazioni aggiornate",
          description: "Le informazioni del ristorante sono state aggiornate",
        });
      },
      onError: (error) => {
        toast({
          title: "Errore",
          description: `Non è stato possibile aggiornare le informazioni: ${error.message}`,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informazioni Ristorante</CardTitle>
        <CardDescription>
          Gestisci le informazioni del tuo ristorante
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <RestaurantDetails 
            restaurantInfo={restaurantInfo} 
            onEdit={() => setIsInfoDialogOpen(true)}
            isUpdating={updateInfoMutation.isPending}
          />
          
          <RestaurantEditDialog 
            isOpen={isInfoDialogOpen}
            onOpenChange={setIsInfoDialogOpen}
            restaurantInfo={restaurantInfo}
            onSave={handleUpdateInfo}
            onCancel={() => setIsInfoDialogOpen(false)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantInfoManagement;
