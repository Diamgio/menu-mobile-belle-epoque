
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MenuItem as MenuItemType, RestaurantInfo as RestaurantInfoType } from "@/types/menu";
import { menuItems as initialMenuItems, restaurantInfo as initialRestaurantInfo } from "@/data/menuData";
import MenuItemForm from "@/components/MenuItemForm";
import RestaurantInfoForm from "@/components/RestaurantInfoForm";

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
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(initialMenuItems);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfoType>(initialRestaurantInfo);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    const newItem = {
      ...item,
      id: uuidv4(),
    };
    setMenuItems([...menuItems, newItem]);
    setIsAddDialogOpen(false);
    toast({
      title: "Piatto aggiunto",
      description: `"${item.name}" è stato aggiunto al menu`,
    });
  };

  const handleEditItem = (item: Omit<MenuItemType, "id">) => {
    if (!editingItem) return;

    setMenuItems(
      menuItems.map((menuItem) =>
        menuItem.id === editingItem.id
          ? { ...item, id: editingItem.id }
          : menuItem
      )
    );
    setIsEditDialogOpen(false);
    setEditingItem(null);
    toast({
      title: "Piatto aggiornato",
      description: `"${item.name}" è stato aggiornato`,
    });
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = menuItems.find((item) => item.id === id);
    if (!itemToDelete) return;

    setMenuItems(menuItems.filter((item) => item.id !== id));
    toast({
      title: "Piatto eliminato",
      description: `"${itemToDelete.name}" è stato rimosso dal menu`,
      variant: "destructive",
    });
  };

  const handleUpdateInfo = (info: RestaurantInfoType) => {
    setRestaurantInfo(info);
    setIsInfoDialogOpen(false);
    toast({
      title: "Informazioni aggiornate",
      description: "Le informazioni del ristorante sono state aggiornate",
    });
  };

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
                    <Button className="gap-2">
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
                        >
                          <PenSquare className="mr-2 h-4 w-4" />
                          Modifica
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteItem(item.id)}
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
                        <Button variant="outline" size="sm" className="h-9">
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
