
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MenuItem as MenuItemType, RestaurantInfo as RestaurantInfoType } from "@/types/menu";
import MenuItemForm from "@/components/MenuItemForm";
import RestaurantInfoForm from "@/components/RestaurantInfoForm";
import { loadMenuData, dishesService, settingsService, transformMenuItemToDbDish, transformRestaurantInfoToDbSettings } from "@/services/supabaseService";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import { Plus, MoreVertical, PenSquare, Trash, LogOut, Eye } from "lucide-react";

const Dashboard = () => {
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for menu data
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['menuData'],
    queryFn: loadMenuData
  });

  const menuItems = data?.menuItems || [];
  const restaurantInfo = data?.restaurantInfo || {
    name: "Caricamento...",
    openingHours: "",
    phone: "",
    address: "",
    socialLinks: {}
  };

  // Mutations
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

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await dishesService.deleteDish(parseInt(id, 10));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
    }
  });

  const updateInfoMutation = useMutation({
    mutationFn: async (info: RestaurantInfoType) => {
      const dbSettings = await transformRestaurantInfoToDbSettings(info);
      return await settingsService.saveSettings(dbSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
    }
  });

  const handleLogout = () => {
    toast({
      title: "Logout effettuato",
      description: "Sei stato disconnesso con successo",
    });
    navigate("/admin");
  };

  const handlePreviewMenu = () => {
    window.open("/", "_blank");
  };

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

  const handleUpdateInfo = (info: RestaurantInfoType) => {
    updateInfoMutation.mutate(info, {
      onSuccess: () => {
        setIsInfoDialogOpen(false);
        toast({
          title: "Informazioni aggiornate",
          description: "Le informazioni del ristorante sono state aggiornate",
        });
      },
      onError: (error) => {
        toast({
          title: "Errore",
          description: `Non è stato possibile aggiornare le informazioni: ${error.message}`,
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold">Caricamento...</div>
          <p className="text-gray-500">Stiamo caricando i dati del ristorante.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold text-red-600">Errore</div>
          <p className="text-gray-500">Si è verificato un errore durante il caricamento dei dati.</p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['menuData'] })}
            className="mt-4"
          >
            Riprova
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard Admin</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handlePreviewMenu}
            >
              <Eye size={16} />
              Anteprima
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Esci
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu">Gestione Menu</TabsTrigger>
            <TabsTrigger value="info">Info Ristorante</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
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
                      categories={data?.categories || []}
                      allergens={data?.allergens || []}
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
                    categories={data?.categories || []}
                    allergens={data?.allergens || []}
                  />
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Ristorante</CardTitle>
                <CardDescription>
                  Gestisci le informazioni del tuo ristorante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-semibold">Dettagli Ristorante</h3>
                      <dl className="mt-2 space-y-2">
                        <div>
                          <dt className="text-xs text-gray-500">Nome</dt>
                          <dd>{restaurantInfo.name}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">
                            Orari di apertura
                          </dt>
                          <dd className="text-sm">{restaurantInfo.openingHours}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Telefono</dt>
                          <dd className="text-sm">{restaurantInfo.phone}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Indirizzo</dt>
                          <dd className="text-sm">{restaurantInfo.address}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Social</dt>
                          <dd className="flex gap-4">
                            {restaurantInfo.socialLinks.facebook && (
                              <a
                                href={restaurantInfo.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Facebook
                              </a>
                            )}
                            {restaurantInfo.socialLinks.instagram && (
                              <a
                                href={restaurantInfo.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:underline"
                              >
                                Instagram
                              </a>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <Dialog
                      open={isInfoDialogOpen}
                      onOpenChange={setIsInfoDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9"
                          disabled={updateInfoMutation.isPending}
                        >
                          <PenSquare className="mr-2 h-4 w-4" />
                          Modifica
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Modifica Informazioni</DialogTitle>
                          <DialogDescription>
                            Aggiorna le informazioni del ristorante
                          </DialogDescription>
                        </DialogHeader>
                        <RestaurantInfoForm
                          info={restaurantInfo}
                          onSave={handleUpdateInfo}
                          onCancel={() => setIsInfoDialogOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
