
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
}

const AllergenFilter = ({
  allergens,
  excludedAllergens,
  onAllergenChange
}: AllergenFilterProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter size={16} />
          Filtro Allergeni
          {excludedAllergens.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
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
