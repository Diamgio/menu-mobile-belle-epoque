
import React from "react";  // Aggiunto import esplicito di React
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Configurazione del QueryClient con un ritardo minimo di 1500ms
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minuti
      gcTime: 1000 * 60 * 10, // 10 minuti
      retry: 1,
      // Aggiungiamo un ritardo minimo per il precaricamento
      placeholderData: (previousData) => {
        // Ritardo artificiale di 1500ms prima di mostrare i dati
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(previousData);
          }, 1500);
        });
      },
    },
  },
});

// Definito esplicitamente come componente React
const App: React.FC = () => (
  <ThemeProvider defaultTheme="system" storageKey="restaurant-menu-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
