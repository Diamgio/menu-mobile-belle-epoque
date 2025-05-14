
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RestaurantInfo } from "@/types/menu";

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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve contenere almeno 2 caratteri",
  }),
  openingHours: z.string().min(5, {
    message: "Gli orari di apertura devono essere specificati",
  }),
  phone: z.string().min(5, {
    message: "Il numero di telefono deve essere valido",
  }),
  address: z.string().min(5, {
    message: "L'indirizzo deve contenere almeno 5 caratteri",
  }),
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
});

interface RestaurantInfoFormProps {
  info: RestaurantInfo;
  onSave: (info: RestaurantInfo) => void;
  onCancel: () => void;
}

const RestaurantInfoForm = ({
  info,
  onSave,
  onCancel,
}: RestaurantInfoFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: info.name,
      openingHours: info.openingHours,
      phone: info.phone,
      address: info.address,
      facebook: info.socialLinks.facebook || "",
      instagram: info.socialLinks.instagram || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      name: values.name,
      openingHours: values.openingHours,
      phone: values.phone,
      address: values.address,
      socialLinks: {
        facebook: values.facebook || undefined,
        instagram: values.instagram || undefined,
      },
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

export default RestaurantInfoForm;
