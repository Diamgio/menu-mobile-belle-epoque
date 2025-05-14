
import { RestaurantInfo as RestaurantInfoType } from "@/types/menu";
import { Phone, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { AspectRatio } from "./ui/aspect-ratio";

interface RestaurantInfoProps {
  info: RestaurantInfoType;
}

const RestaurantInfo = ({ info }: RestaurantInfoProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info size={16} />
          Info
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center">
          {info.logo && (
            <div className="mb-4 mx-auto max-w-[200px]">
              <AspectRatio ratio={1} className="overflow-hidden rounded-md">
                <img 
                  src={info.logo} 
                  alt={info.name}
                  className="w-full h-full object-contain"
                />
              </AspectRatio>
            </div>
          )}
          <DrawerTitle>{info.name}</DrawerTitle>
          <DrawerDescription>Informazioni sul ristorante</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-4">
          <div className="flex items-start gap-3">
            <Clock className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <h4 className="font-medium">Orari di apertura</h4>
              <p className="text-sm text-gray-500">{info.openingHours}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <h4 className="font-medium">Telefono</h4>
              <a 
                href={`tel:${info.phone}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {info.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <h4 className="font-medium">Indirizzo</h4>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(info.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {info.address}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            {info.socialLinks.facebook && (
              <a 
                href={info.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600"
              >
                <Facebook className="h-6 w-6" />
              </a>
            )}
            {info.socialLinks.instagram && (
              <a 
                href={info.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-pink-600"
              >
                <Instagram className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RestaurantInfo;
