
import { UseFormReturn } from "react-hook-form";
import { RestaurantFormValues } from "./restaurantFormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoFieldsProps {
  form: UseFormReturn<RestaurantFormValues>;
}

const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome del ristorante</FormLabel>
            <FormControl>
              <Input placeholder="Trattoria Bella Italia" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="openingHours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Orari di apertura</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lun-Ven: 12:00-14:30, 19:00-23:00. Sab-Dom: 12:00-15:00, 19:00-23:30"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefono</FormLabel>
            <FormControl>
              <Input placeholder="+39 123 456 7890" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indirizzo</FormLabel>
            <FormControl>
              <Input placeholder="Via Roma 123, Milano, Italia" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoFields;
