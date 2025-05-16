
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GalleryProvider } from "@/contexts/GalleryContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Initializing the QueryClient outside the component
const queryClient = new QueryClient();

// Explicitly defined as React component
const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Handle online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connessione internet ripristinata");
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Sei offline. Alcune funzionalità potrebbero non essere disponibili.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Parse URL for restaurant subdomain
  useEffect(() => {
    const parsePath = () => {
      const path = window.location.pathname;
      
      // Check if it's a restaurant-specific path (/r/[subdomain])
      const match = path.match(/^\/r\/([a-z0-9-]+)/i);
      if (match && match[1]) {
        setSubdomain(match[1]);
        
        // Fetch restaurant info
        fetchRestaurantBySubdomain(match[1]);
      } else {
        setSubdomain(null);
        setRestaurantId(null);
        setIsLoading(false);
      }
    };
    
    parsePath();
  }, []);
  
  // Fetch restaurant by subdomain
  const fetchRestaurantBySubdomain = async (subdomain: string) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id')
        .eq('subdomain', subdomain)
        .single();
      
      if (error) {
        console.error('Error fetching restaurant:', error);
        setRestaurantId(null);
      } else {
        setRestaurantId(data.id);
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setRestaurantId(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold dark:text-white">Caricamento...</div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="restaurant-menu-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <GalleryProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  {/* Restaurant-specific routes */}
                  {subdomain && restaurantId ? (
                    <Route path="/r/:subdomain" element={<MenuPage restaurantId={restaurantId} />} />
                  ) : (
                    <>
                      {/* Main SaaS routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/admin" element={<Login />} />
                      <Route element={<ProtectedRoute />}>
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </>
                  )}
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </GalleryProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
