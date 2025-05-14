
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

interface MenuItemProps {
  item: MenuItemType;
  excludedAllergens: string[];
}

const MenuItem = ({ item, excludedAllergens }: MenuItemProps) => {
  const hasExcludedAllergen = item.allergens.some(allergen => 
    excludedAllergens.includes(allergen)
  );

  return (
    <Card className={cn(
      "transition-opacity duration-200",
      hasExcludedAllergen && excludedAllergens.length > 0 ? "opacity-50" : "opacity-100"
    )}>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 pb-2">
            <p className="font-semibold text-primary">€{item.price.toFixed(2)}</p>
          </CardContent>
          {item.allergens.length > 0 && (
            <CardFooter className="flex flex-wrap gap-1 p-4 pt-0">
              {item.allergens.map((allergen) => (
                <Badge 
                  key={allergen} 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    excludedAllergens.includes(allergen) ? "bg-red-100" : ""
                  )}
                >
                  {allergen}
                </Badge>
              ))}
            </CardFooter>
          )}
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="aspect-square h-24 w-24 rounded-md object-cover"
          />
        </div>
      </div>
    </Card>
  );
};

export default MenuItem;
