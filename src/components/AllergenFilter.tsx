
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
          className={`${isFloating ? "rounded-full shadow-lg h-14 w-14 md:h-auto md:w-auto md:rounded-md md:px-5 md:py-2 md:text-base" : "gap-2 text-base"}`}
        >
          <Filter size={isFloating ? 20 : 16} />
          {!isFloating && "Filtro Allergeni"}
          {!isFloating && excludedAllergens.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-sm text-white">
              {excludedAllergens.length}
            </span>
          )}
          {isFloating && excludedAllergens.length > 0 && (
            <span className="absolute -top-2 -right-2 rounded-full bg-red-500 w-6 h-6 flex items-center justify-center text-sm text-white">
              {excludedAllergens.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl">Filtro Allergeni</SheetTitle>
          <SheetDescription className="text-base">
            Seleziona gli allergeni da escludere
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-5">
          {allergens.map((allergen) => (
            <div key={allergen} className="flex items-center space-x-3">
              <Checkbox
                id={`allergen-${allergen}`}
                checked={excludedAllergens.includes(allergen)}
                onCheckedChange={() => onAllergenChange(allergen)}
                className="h-5 w-5"
              />
              <label
                htmlFor={`allergen-${allergen}`}
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
