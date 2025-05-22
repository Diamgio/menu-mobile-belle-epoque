
import { RestaurantInfo as RestaurantInfoType } from "@/types/menu";
import { Phone, MapPin, Clock, Facebook, Instagram, Settings } from "lucide-react";
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
import ZoomableImage from "./ZoomableImage";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface RestaurantInfoProps {
  info: RestaurantInfoType;
  floatingButton?: boolean;
}

const RestaurantInfo = ({ info, floatingButton = false }: RestaurantInfoProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {floatingButton ? (
          <Button 
            variant="default" 
            size="icon" 
            className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
          >
            <Info className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-2">
            <Info size={16} />
            Info
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <div className="space-y-6 py-6">
          {info.logo && (
            <div className="mb-4 mx-auto max-w-[150px]">
              <ZoomableImage
                src={info.logo}
                alt={info.name}
                containerClassName="w-full h-full"
                aspectRatio={1}
              />
            </div>
          )}
          <div className="text-center">
            <h2 className="font-semibold text-xl">{info.name}</h2>
            <p className="text-sm text-muted-foreground">Informazioni sul ristorante</p>
          </div>

          <div className="space-y-4">
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
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {info.socialLinks.instagram && (
                <a 
                  href={info.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-500"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-3">Preferenze</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tema</span>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <Link to="/admin">
              <Button 
                variant="outline" 
                className="w-full gap-2"
              >
                <Settings size={16} />
                Amministrazione
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RestaurantInfo;
