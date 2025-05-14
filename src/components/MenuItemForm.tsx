
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem } from "@/types/menu";
import { categories, allergens } from "@/data/menuData";
import ImageUploader from "./ImageUploader";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AspectRatio } from "./ui/aspect-ratio";

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
}

const MenuItemForm = ({ item, onSave, onCancel }: MenuItemFormProps) => {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(
    item?.allergens || []
  );
  const [imageUrl, setImageUrl] = useState<string>(item?.image || "/placeholder.svg");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || 0,
      category: item?.category || categories[0],
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      name: values.name,
      description: values.description,
      price: values.price,
      category: values.category,
      image: imageUrl || "/placeholder.svg",
      allergens: selectedAllergens,
    });
  };

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
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
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
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Immagine del piatto</FormLabel>
          {imageUrl !== "/placeholder.svg" ? (
            <div className="space-y-4">
              <AspectRatio ratio={4 / 3} className="bg-muted rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Immagine del piatto"
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              <ImageUploader
                onImageUploaded={handleImageUploaded}
                folder="dishes"
                buttonText="Cambia immagine"
                existingImageUrl={imageUrl}
              />
            </div>
          ) : (
            <ImageUploader
              onImageUploaded={handleImageUploaded}
              folder="dishes"
              buttonText="Carica immagine"
            />
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Allergeni</p>
          <div className="grid grid-cols-2 gap-2">
            {allergens.map((allergen) => (
              <div
                key={allergen}
                className="flex items-center space-x-2 rounded-md border p-2"
              >
                <Checkbox
                  id={`allergen-${allergen}`}
                  checked={selectedAllergens.includes(allergen)}
                  onCheckedChange={() => toggleAllergen(allergen)}
                />
                <label
                  htmlFor={`allergen-${allergen}`}
                  className="text-sm font-medium leading-none"
                >
                  {allergen}
                </label>
              </div>
            ))}
          </div>
        </div>

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
