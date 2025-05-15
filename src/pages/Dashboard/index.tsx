
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { loadMenuData } from "@/services/supabaseService";
import MenuManagement from "./components/MenuManagement";
import RestaurantInfoManagement from "./components/RestaurantInfoManagement";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
            onClick={() => window.location.reload()}
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
            <MenuManagement 
              menuItems={menuItems}
              categories={data?.categories || []}
              allergens={data?.allergens || []}
            />
          </TabsContent>

          <TabsContent value="info">
            <RestaurantInfoManagement 
              restaurantInfo={restaurantInfo}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
