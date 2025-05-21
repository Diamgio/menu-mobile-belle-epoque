
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
          size={isFloating ? "default" : "sm"}
          className={`${isFloating ? "rounded-full shadow-lg h-12 w-auto md:rounded-md" : "gap-2"} flex items-center`}
        >
          <Filter size={16} className="mr-2" />
          <span className="text-base">Allergeni</span>
          {excludedAllergens.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
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
        <div className="mt-6 space-y-4">
          {allergens.map((allergen) => (
            <div key={allergen} className="flex items-center space-x-3">
              <Checkbox
                id={`allergen-${allergen}`}
                checked={excludedAllergens.includes(allergen)}
                onCheckedChange={() => onAllergenChange(allergen)}
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
