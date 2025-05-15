
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RestaurantInfo } from "@/types/menu";
import { settingsService, transformRestaurantInfoToDbSettings } from "@/services/supabaseService";

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
    }
  });

  return {
    updateInfoMutation
  };
};
