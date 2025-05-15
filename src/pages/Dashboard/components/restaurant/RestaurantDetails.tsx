
import { RestaurantInfo } from "@/types/menu";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestaurantDetailsProps {
  restaurantInfo: RestaurantInfo;
  onEdit: () => void;
  isUpdating: boolean;
}

const RestaurantDetails = ({ restaurantInfo, onEdit, isUpdating }: RestaurantDetailsProps) => {
  return (
    <div className="flex justify-between rounded-lg border p-4">
      <div>
        <h3 className="font-semibold">Dettagli Ristorante</h3>
        <dl className="mt-2 space-y-2">
          {restaurantInfo.logo && (
            <div>
              <dt className="text-xs text-gray-500">Logo</dt>
              <dd className="w-16 h-16">
                <img 
                  src={restaurantInfo.logo} 
                  alt="Logo ristorante" 
                  className="w-full h-full object-contain"
                />
              </dd>
            </div>
          )}
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
      <Button 
        variant="outline" 
        size="sm" 
        className="h-9"
        onClick={onEdit}
        disabled={isUpdating}
      >
        <PenSquare className="mr-2 h-4 w-4" />
        Modifica
      </Button>
    </div>
  );
};

export default RestaurantDetails;
