
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Eye, CreditCard, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { loadMenuData } from "@/services/supabaseService";
import { ThemeToggle } from "@/components/ThemeToggle";
import MenuManagement from "./components/MenuManagement";
import RestaurantInfoManagement from "./components/RestaurantInfoManagement";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    signOut, 
    user, 
    currentRestaurant, 
    setCurrentRestaurant, 
    restaurants, 
    subscription, 
    checkSubscription, 
    createSubscription, 
    manageSubscription 
  } = useAuth();

  // Check if the user is authenticated, redirect if not
  useAuthRedirect({ redirectTo: "/admin", shouldBeAuthenticated: true });

  // State for subscription loading
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);

  // Format date for subscription display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Query for menu data
  const { 
    data, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['menuData', currentRestaurant?.id],
    queryFn: () => loadMenuData(),
    enabled: !!currentRestaurant,
  });

  // Refresh subscription status
  const handleRefreshSubscription = async () => {
    if (!currentRestaurant) return;
    setIsSubscriptionLoading(true);
    await checkSubscription(currentRestaurant.id);
    setIsSubscriptionLoading(false);
    toast({
      title: "Abbonamento aggiornato",
      description: "Lo stato dell'abbonamento è stato aggiornato"
    });
  };

  // Handle restaurant change
  const handleRestaurantChange = (value: string) => {
    const restaurant = restaurants.find(r => r.id.toString() === value);
    if (restaurant) {
      setCurrentRestaurant(restaurant);
    }
  };

  // Create new subscription
  const handleCreateSubscription = async () => {
    if (!currentRestaurant) return;
    
    setIsSubscriptionLoading(true);
    try {
      const url = await createSubscription(currentRestaurant.id);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile creare l'abbonamento"
      });
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  // Manage existing subscription
  const handleManageSubscription = async () => {
    if (!currentRestaurant) return;
    
    setIsSubscriptionLoading(true);
    try {
      const url = await manageSubscription(currentRestaurant.id);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error("Error managing subscription:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile gestire l'abbonamento"
      });
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  // Check subscription status when restaurant changes
  useEffect(() => {
    if (currentRestaurant) {
      checkSubscription(currentRestaurant.id);
    }
  }, [currentRestaurant]);

  // Check for URL parameters (for Stripe redirect)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get('session_id');
    
    // If we have a session ID, refresh subscription status
    if (sessionId && currentRestaurant) {
      handleRefreshSubscription();
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('session_id');
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, [currentRestaurant]);

  const menuItems = data?.menuItems || [];
  const restaurantInfo = data?.restaurantInfo || {
    name: "Caricamento...",
    openingHours: "",
    phone: "",
    address: "",
    socialLinks: {}
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout effettuato",
        description: "Sei stato disconnesso con successo",
      });
    } catch (error) {
      console.error("Errore durante il logout:", error);
      toast({
        variant: "destructive",
        title: "Errore durante il logout",
        description: "Si è verificato un errore durante il logout"
      });
    }
  };

  const handlePreviewMenu = () => {
    if (!currentRestaurant) return;
    window.open(`/r/${currentRestaurant.subdomain}`, "_blank");
  };

  if (isLoading && currentRestaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold dark:text-white">Caricamento...</div>
          <p className="text-gray-500 dark:text-gray-400">Stiamo caricando i dati del ristorante.</p>
        </div>
      </div>
    );
  }

  if (error && currentRestaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-4 text-3xl font-bold text-red-600 dark:text-red-500">Errore</div>
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error instanceof Error ? error.message : "Si è verificato un errore durante il caricamento dei dati."}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => refetch()}
            className="mt-4"
          >
            Riprova
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold dark:text-white">Dashboard Admin</h1>
            
            {restaurants.length > 0 && (
              <Select 
                value={currentRestaurant?.id.toString()} 
                onValueChange={handleRestaurantChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleziona ristorante" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem 
                      key={restaurant.id} 
                      value={restaurant.id.toString()}
                    >
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {currentRestaurant && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handlePreviewMenu}
              >
                <Eye size={16} />
                Anteprima
              </Button>
            )}
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
        {!currentRestaurant ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">Nessun ristorante selezionato</h2>
            <p className="mb-4">Non hai ancora creato un ristorante o non ne hai selezionato uno.</p>
            <Button 
              onClick={() => navigate("/admin")}
              className="mt-2"
            >
              Torna alla pagina di login
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="menu" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="menu">Gestione Menu</TabsTrigger>
              <TabsTrigger value="info">Info Ristorante</TabsTrigger>
              <TabsTrigger value="subscription">Abbonamento</TabsTrigger>
            </TabsList>

            <TabsContent value="menu">
              {!subscription?.active ? (
                <div className="text-center py-10">
                  <h2 className="text-2xl font-bold mb-4">Abbonamento richiesto</h2>
                  <p className="mb-6">Per gestire il menu del tuo ristorante, è necessario attivare un abbonamento.</p>
                  <Button 
                    onClick={handleCreateSubscription}
                    disabled={isSubscriptionLoading}
                    className="mt-2"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isSubscriptionLoading ? "Caricamento..." : "Attiva abbonamento - €19/mese"}
                  </Button>
                </div>
              ) : (
                <MenuManagement 
                  menuItems={menuItems}
                  categories={data?.categories || []}
                  allergens={data?.allergens || []}
                />
              )}
            </TabsContent>

            <TabsContent value="info">
              <RestaurantInfoManagement 
                restaurantInfo={restaurantInfo}
              />
            </TabsContent>

            <TabsContent value="subscription">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Stato Abbonamento</CardTitle>
                    <CardDescription>
                      Gestisci l'abbonamento per il tuo menu digitale
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Stato:</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        subscription?.active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {subscription?.active ? "Attivo" : "Inattivo"}
                      </span>
                    </div>

                    {subscription?.active && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Piano:</span>
                          <span>Menu Digitale (€19/mese)</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Prossimo rinnovo:</span>
                          <span>{formatDate(subscription?.current_period_end)}</span>
                        </div>
                      </>
                    )}

                    <div className="pt-4">
                      {subscription?.active ? (
                        <Button 
                          onClick={handleManageSubscription}
                          disabled={isSubscriptionLoading}
                          className="w-full"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          {isSubscriptionLoading ? "Caricamento..." : "Gestisci abbonamento"}
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleCreateSubscription}
                          disabled={isSubscriptionLoading}
                          className="w-full"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          {isSubscriptionLoading ? "Caricamento..." : "Attiva abbonamento - €19/mese"}
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={handleRefreshSubscription}
                        disabled={isSubscriptionLoading}
                        className="w-full mt-2"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {isSubscriptionLoading ? "Aggiornamento..." : "Aggiorna stato abbonamento"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Incluso nell'abbonamento</CardTitle>
                    <CardDescription>
                      Funzionalità disponibili con il piano a €19/mese
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Menu digitale con QR code</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Caricamento illimitato di piatti</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Personalizzazione logo e dati del ristorante</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Gestione allergie e categorie</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Supporto tecnico</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
