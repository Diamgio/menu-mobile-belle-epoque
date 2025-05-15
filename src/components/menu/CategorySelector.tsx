
import { useState, FormEvent } from "react";
import { FormControl, FormDescription, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySelector = ({
  categories,
  selectedCategory,
  onCategoryChange
}: CategorySelectorProps) => {
  const [newCategory, setNewCategory] = useState<string>("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState<boolean>(false);

  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setIsAddingNewCategory(true);
      return;
    }
    onCategoryChange(value);
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() === "") return;
    
    // Check if category already exists
    if (categories.includes(newCategory.trim())) {
      toast.error("Questa categoria esiste già");
      return;
    }
    
    // Call the parent's category change handler with the new category
    onCategoryChange(newCategory.trim());
    
    // Reset the state
    setNewCategory("");
    setIsAddingNewCategory(false);
    
    // Show success toast
    toast.success(`Categoria "${newCategory.trim()}" aggiunta`);
  };

  return (
    <>
      <FormLabel>Categoria</FormLabel>
      {!isAddingNewCategory ? (
        <div className="space-y-2">
          <Select
            onValueChange={handleCategoryChange}
            value={selectedCategory}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona una categoria" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
              <SelectItem value="new" className="text-primary font-medium">
                + Aggiungi nuova categoria
              </SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Seleziona una categoria esistente o creane una nuova
          </FormDescription>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <FormControl>
              <Input
                placeholder="Nome della nuova categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1"
                autoFocus
              />
            </FormControl>
            <Button 
              type="button" 
              onClick={handleAddNewCategory}
              disabled={!newCategory.trim()}
            >
              <Plus className="mr-1" size={16} />
              Aggiungi
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddingNewCategory(false)}
            >
              Annulla
            </Button>
          </div>
          <FormDescription>
            Inserisci il nome della nuova categoria. Verrà aggiunta al salvataggio del piatto.
          </FormDescription>
        </div>
      )}
    </>
  );
};

export default CategorySelector;
