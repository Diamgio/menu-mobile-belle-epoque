
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RestaurantInfo } from "@/types/menu";
import { settingsService, transformRestaurantInfoToDbSettings } from "@/services/supabaseService";
import { toast } from "sonner";

export const useRestaurantInfoMutation = () => {
  const queryClient = useQueryClient();

  // Update restaurant info mutation
  const updateInfoMutation = useMutation({
    mutationFn: async (info: RestaurantInfo) => {
      const dbSettings = await transformRestaurantInfoToDbSettings(info);
      return await settingsService.saveSettings(dbSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success("Informazioni del ristorante aggiornate con successo");
    },
    onError: (error: Error) => {
      toast.error(`Errore nell'aggiornamento delle informazioni: ${error.message}`);
    }
  });

  return {
    updateInfoMutation
  };
};
