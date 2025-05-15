
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MenuItem as MenuItemType } from "@/types/menu";
import { dishesService, transformMenuItemToDbDish } from "@/services/supabaseService";

export const useMenuItemMutations = () => {
  const queryClient = useQueryClient();

  // Add menu item mutation
  const addItemMutation = useMutation({
    mutationFn: async (item: Omit<MenuItemType, "id">) => {
      const { dish, allergenIds } = await transformMenuItemToDbDish(item);
      const newDish = await dishesService.createDish(dish);
      await dishesService.updateDishAllergens(newDish.id, allergenIds);
      return newDish;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
    }
  });

  // Update menu item mutation
  const updateItemMutation = useMutation({
    mutationFn: async (params: { id: string; item: Omit<MenuItemType, "id"> }) => {
      const { dish, allergenIds } = await transformMenuItemToDbDish(params.item, params.id);
      const updatedDish = await dishesService.updateDish(parseInt(params.id, 10), dish);
      await dishesService.updateDishAllergens(updatedDish.id, allergenIds);
      return updatedDish;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
    }
  });

  // Delete menu item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await dishesService.deleteDish(parseInt(id, 10));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
    }
  });

  return {
    addItemMutation,
    updateItemMutation,
    deleteItemMutation
  };
};
