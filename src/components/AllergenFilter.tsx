
import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

interface AllergenFilterProps {
  allergens: string[];
  excludedAllergens: string[];
  onAllergenChange: (allergen: string) => void;
  isFloating?: boolean;
}

const AllergenFilter = ({
  allergens,
  excludedAllergens,
  onAllergenChange,
  isFloating = false
}: AllergenFilterProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant={isFloating ? "default" : "outline"} 
          size={isFloating ? "icon" : "sm"}
          className={`${isFloating ? "rounded-full shadow-lg h-12 w-12 md:h-auto md:w-auto md:rounded-md md:px-4" : "gap-2"}`}
        >
          <Filter size={16} />
          {!isFloating && "Filtro Allergeni"}
          {!isFloating && excludedAllergens.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
              {excludedAllergens.length}
            </span>
          )}
          {isFloating && excludedAllergens.length > 0 && (
            <span className="absolute -top-2 -right-2 rounded-full bg-red-500 w-5 h-5 flex items-center justify-center text-xs text-white">
              {excludedAllergens.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtro Allergeni</SheetTitle>
          <SheetDescription>
            Seleziona gli allergeni da escludere
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {allergens.map((allergen) => (
            <div key={allergen} className="flex items-center space-x-2">
              <Checkbox
                id={`allergen-${allergen}`}
                checked={excludedAllergens.includes(allergen)}
                onCheckedChange={() => onAllergenChange(allergen)}
              />
              <label
                htmlFor={`allergen-${allergen}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {allergen}
              </label>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AllergenFilter;
