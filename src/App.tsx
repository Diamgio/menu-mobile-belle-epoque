
import React from "react";
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

// Initializing the QueryClient outside the component
const queryClient = new QueryClient();

// Explicitly defined as React component
const App: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  
  React.useEffect(() => {
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

  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="restaurant-menu-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <GalleryProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AuthProvider>
                  <Routes>
                    <Route path="/" element={<MenuPage />} />
                    <Route path="/admin" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="/admin/dashboard" element={<Dashboard />} />
                    </Route>
                    <Route path="/home" element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AuthProvider>
              </BrowserRouter>
            </GalleryProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
