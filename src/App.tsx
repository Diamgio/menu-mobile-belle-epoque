
import * as React from "react";
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

// Verify React is available
console.log("App initializing with React:", !!React);

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App: React.FC = () => {
  // Component initialization with logging
  React.useEffect(() => {
    console.log("App component mounted");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="system" storageKey="restaurant-menu-theme">
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
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
