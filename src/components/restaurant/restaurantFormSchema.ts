
import { z } from "zod";

export const restaurantFormSchema = z.object({
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
  logo: z.string().optional(),
});

export type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;
