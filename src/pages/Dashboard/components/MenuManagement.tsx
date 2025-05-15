
import { useState } from "react";
import { MenuItem as MenuItemType } from "@/types/menu";
import MenuItemForm from "@/components/MenuItemForm";
import { useToast } from "@/hooks/use-toast";
import { useMenuItemMutations } from "../hooks/useMenuItemMutations";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, PenSquare, Trash } from "lucide-react";

interface MenuManagementProps {
  menuItems: MenuItemType[];
  categories: string[];
  allergens: string[];
}

const MenuManagement = ({ menuItems, categories, allergens }: MenuManagementProps) => {
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const { addItemMutation, updateItemMutation, deleteItemMutation } = useMenuItemMutations();

  const handleAddItem = (item: Omit<MenuItemType, "id">) => {
    addItemMutation.mutate(item, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        toast({
          title: "Piatto aggiunto",
          description: `"${item.name}" è stato aggiunto al menu`,
        });
      },
      onError: (error) => {
        toast({
          title: "Errore",
          description: `Non è stato possibile aggiungere "${item.name}": ${error.message}`,
          variant: "destructive"
        });
      }
    });
  };

  const handleEditItem = (item: Omit<MenuItemType, "id">) => {
    if (!editingItem) return;

    updateItemMutation.mutate({ id: editingItem.id, item }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setEditingItem(null);
        toast({
          title: "Piatto aggiornato",
          description: `"${item.name}" è stato aggiornato`,
        });
      },
      onError: (error) => {
        toast({
          title: "Errore",
          description: `Non è stato possibile aggiornare "${item.name}": ${error.message}`,
          variant: "destructive"
        });
      }
    });
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = menuItems.find((item) => item.id === id);
    if (!itemToDelete) return;

    deleteItemMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Piatto eliminato",
          description: `"${itemToDelete.name}" è stato rimosso dal menu`,
        });
      },
      onError: (error) => {
        toast({
          title: "Errore",
          description: `Non è stato possibile eliminare "${itemToDelete.name}": ${error.message}`,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Menu del Ristorante</CardTitle>
            <CardDescription>
              Gestisci i piatti del tuo menu
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={addItemMutation.isPending}>
                <Plus size={16} />
                Nuovo Piatto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Aggiungi Nuovo Piatto</DialogTitle>
                <DialogDescription>
                  Inserisci i dettagli del nuovo piatto
                </DialogDescription>
              </DialogHeader>
              <MenuItemForm
                onSave={handleAddItem}
                onCancel={() => setIsAddDialogOpen(false)}
                categories={categories}
                allergens={allergens}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between rounded-lg border p-4"
            >
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {item.description}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-medium">
                      €{item.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingItem(item);
                      setIsEditDialogOpen(true);
                    }}
                    disabled={updateItemMutation.isPending}
                  >
                    <PenSquare className="mr-2 h-4 w-4" />
                    Modifica
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={deleteItemMutation.isPending}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Elimina
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}

          {menuItems.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              Nessun piatto nel menu. Aggiungi il tuo primo piatto!
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Piatto</DialogTitle>
            <DialogDescription>
              Modifica i dettagli del piatto
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <MenuItemForm
              item={editingItem}
              onSave={handleEditItem}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingItem(null);
              }}
              categories={categories}
              allergens={allergens}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuManagement;
