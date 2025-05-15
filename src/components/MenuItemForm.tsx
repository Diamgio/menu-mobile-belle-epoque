import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem } from "@/types/menu";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Import our new components
import CategorySelector from "./menu/CategorySelector";
import DishImageUploader from "./menu/DishImageUploader";
import AllergenSelector from "./menu/AllergenSelector";

// Keep the form schema the same
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve contenere almeno 2 caratteri",
  }),
  description: z.string().min(10, {
    message: "La descrizione deve contenere almeno 10 caratteri",
  }),
  price: z.coerce.number().positive({
    message: "Il prezzo deve essere un numero positivo",
  }),
  category: z.string({
    required_error: "Seleziona una categoria",
  })
});

interface MenuItemFormProps {
  item?: MenuItem;
  onSave: (item: Omit<MenuItem, "id">) => void;
  onCancel: () => void;
  categories?: string[];
  allergens?: string[];
}

const MenuItemForm = ({ 
  item, 
  onSave, 
  onCancel,
  categories = [], 
  allergens = [] 
}: MenuItemFormProps) => {
  const queryClient = useQueryClient();
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(
    item?.allergens || []
  );
  const [imageUrl, setImageUrl] = useState<string>(item?.image || "/placeholder.svg");
  const [localCategories, setLocalCategories] = useState<string[]>(categories);

  // Update local categories when props change
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || 0,
      category: item?.category || (categories.length > 0 ? categories[0] : ""),
    },
  });

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens((current) =>
      current.includes(allergen)
        ? current.filter((a) => a !== allergen)
        : [...current, allergen]
    );
  };

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  const handleCategoryChange = (category: string) => {
    // If it's a new category that doesn't exist in our list yet
    if (!localCategories.includes(category)) {
      // Add to local categories
      setLocalCategories(prev => [...prev, category]);
      
      // Invalidate queries to ensure fresh data on the next fetch
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
    }
    
    // Set the form value
    form.setValue("category", category);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Invalidate queries to ensure fresh data on the next fetch
    queryClient.invalidateQueries({ queryKey: ['menuData'] });
    
    onSave({
      name: values.name,
      description: values.description,
      price: values.price,
      category: values.category,
      image: imageUrl || "/placeholder.svg",
      allergens: selectedAllergens,
    });
  };

  // Get all categories including user-entered categories
  const allCategories = [...new Set([
    ...(item?.category ? [item.category] : []), 
    ...localCategories
  ])];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome del piatto</FormLabel>
              <FormControl>
                <Input placeholder="Spaghetti alla Carbonara" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrizione dettagliata del piatto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prezzo (€)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="12.50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <CategorySelector
                categories={allCategories}
                selectedCategory={field.value}
                onCategoryChange={handleCategoryChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <DishImageUploader 
          imageUrl={imageUrl} 
          onImageUploaded={handleImageUploaded}
        />

        <AllergenSelector
          allergens={allergens}
          selectedAllergens={selectedAllergens}
          onToggleAllergen={toggleAllergen}
        />

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
          <Button type="submit">Salva</Button>
        </div>
      </form>
    </Form>
  );
};

export default MenuItemForm;
