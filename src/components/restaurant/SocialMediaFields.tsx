
import { UseFormReturn } from "react-hook-form";
import { RestaurantFormValues } from "./restaurantFormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SocialMediaFieldsProps {
  form: UseFormReturn<RestaurantFormValues>;
}

const SocialMediaFields = ({ form }: SocialMediaFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="facebook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook (URL)</FormLabel>
            <FormControl>
              <Input placeholder="https://facebook.com/tuoristorante" {...field} />
            </FormControl>
            <FormDescription>Opzionale</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram (URL)</FormLabel>
            <FormControl>
              <Input placeholder="https://instagram.com/tuoristorante" {...field} />
            </FormControl>
            <FormDescription>Opzionale</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SocialMediaFields;
