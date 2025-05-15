
import { MenuItem as MenuItemType } from "@/types/menu";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ZoomableImage from "./ZoomableImage";

interface MenuItemProps {
  item: MenuItemType;
  excludedAllergens: string[];
  itemIndex?: number; // Index of this item in the menu array
}

const MenuItem = ({ item, excludedAllergens, itemIndex = 0 }: MenuItemProps) => {
  const hasExcludedAllergen = item.allergens.some(allergen => 
    excludedAllergens.includes(allergen)
  );

  // Convert image to array if it's a string for compatibility
  const images = item.images || (item.image ? [item.image] : []);

  return (
    <Card className={cn(
      "transition-opacity duration-200",
      hasExcludedAllergen && excludedAllergens.length > 0 ? "opacity-50" : "opacity-100"
    )}>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="menu-item-title">{item.name}</CardTitle>
            <CardDescription className="mt-2 menu-item-description">
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2 pb-2">
            <p className="menu-item-price text-primary">€{item.price.toFixed(2)}</p>
          </CardContent>
          {item.allergens.length > 0 && (
            <CardFooter className="flex flex-wrap gap-2 p-5 pt-2">
              {item.allergens.map((allergen) => (
                <Badge 
                  key={allergen} 
                  variant="outline" 
                  className={cn(
                    "text-sm px-2 py-1",
                    excludedAllergens.includes(allergen) ? "bg-red-100" : ""
                  )}
                >
                  {allergen}
                </Badge>
              ))}
            </CardFooter>
          )}
        </div>
        <div className="col-span-1 flex items-center justify-center p-3">
          <ZoomableImage
            src={images}
            alt={item.name}
            className="rounded-md"
            containerClassName="h-28 w-28"
            aspectRatio={1}
            itemIndex={itemIndex}
          />
        </div>
      </div>
    </Card>
  );
};

export default MenuItem;
