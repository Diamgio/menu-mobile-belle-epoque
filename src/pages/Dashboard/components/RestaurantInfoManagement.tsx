
import { useState } from "react";
import { RestaurantInfo } from "@/types/menu";
import RestaurantInfoForm from "@/components/RestaurantInfoForm";
import { useRestaurantInfoMutation } from "../hooks/useRestaurantInfoMutation";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";

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
          <div className="flex justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">Dettagli Ristorante</h3>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-xs text-gray-500">Nome</dt>
                  <dd>{restaurantInfo.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">
                    Orari di apertura
                  </dt>
                  <dd className="text-sm">{restaurantInfo.openingHours}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Telefono</dt>
                  <dd className="text-sm">{restaurantInfo.phone}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Indirizzo</dt>
                  <dd className="text-sm">{restaurantInfo.address}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Social</dt>
                  <dd className="flex gap-4">
                    {restaurantInfo.socialLinks.facebook && (
                      <a
                        href={restaurantInfo.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Facebook
                      </a>
                    )}
                    {restaurantInfo.socialLinks.instagram && (
                      <a
                        href={restaurantInfo.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:underline"
                      >
                        Instagram
                      </a>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
            <Dialog
              open={isInfoDialogOpen}
              onOpenChange={setIsInfoDialogOpen}
            >
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9"
                  disabled={updateInfoMutation.isPending}
                >
                  <PenSquare className="mr-2 h-4 w-4" />
                  Modifica
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Modifica Informazioni</DialogTitle>
                  <DialogDescription>
                    Aggiorna le informazioni del ristorante
                  </DialogDescription>
                </DialogHeader>
                <RestaurantInfoForm
                  info={restaurantInfo}
                  onSave={handleUpdateInfo}
                  onCancel={() => setIsInfoDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantInfoManagement;
