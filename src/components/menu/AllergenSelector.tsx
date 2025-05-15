
import { Checkbox } from "@/components/ui/checkbox";

interface AllergenSelectorProps {
  allergens: string[];
  selectedAllergens: string[];
  onToggleAllergen: (allergen: string) => void;
}

const AllergenSelector = ({
  allergens,
  selectedAllergens,
  onToggleAllergen
}: AllergenSelectorProps) => {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Allergeni</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {allergens.map((allergen) => (
          <div
            key={allergen}
            className="flex items-center space-x-2 rounded-md border p-3 sm:p-2 transition-colors hover:bg-muted/50"
          >
            <Checkbox
              id={`allergen-${allergen}`}
              checked={selectedAllergens.includes(allergen)}
              onCheckedChange={() => onToggleAllergen(allergen)}
              className="h-5 w-5 sm:h-4 sm:w-4"
            />
            <label
              htmlFor={`allergen-${allergen}`}
              className="text-sm font-medium leading-none w-full cursor-pointer"
            >
              {allergen}
            </label>
          </div>
        ))}
        {allergens.length === 0 && selectedAllergens.map((allergen) => (
          <div
            key={allergen}
            className="flex items-center space-x-2 rounded-md border p-3 sm:p-2 transition-colors hover:bg-muted/50"
          >
            <Checkbox
              id={`allergen-${allergen}`}
              checked={true}
              onCheckedChange={() => onToggleAllergen(allergen)}
              className="h-5 w-5 sm:h-4 sm:w-4"
            />
            <label
              htmlFor={`allergen-${allergen}`}
              className="text-sm font-medium leading-none w-full cursor-pointer"
            >
              {allergen}
            </label>
          </div>
        ))}
      </div>
      {allergens.length === 0 && selectedAllergens.length === 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Nessun allergene disponibile. Gli allergeni verranno creati automaticamente quando salvi il piatto.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllergenSelector;
