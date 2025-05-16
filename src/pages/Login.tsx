
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  // Auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration states
  const [restaurantName, setRestaurantName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [registrationStep, setRegistrationStep] = useState(1);
  
  const { signIn, signUp, createRestaurant } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  useAuthRedirect({ redirectTo: "/admin/dashboard", shouldBeAuthenticated: false });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      
      toast({
        title: "Login effettuato",
        description: "Accesso eseguito con successo",
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Errore login:", error);
      toast({
        variant: "destructive",
        title: "Errore di accesso",
        description: "Email o password non validi. Riprova."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      
      setRegistrationStep(2);
    } catch (error) {
      console.error("Errore registrazione:", error);
      toast({
        variant: "destructive",
        title: "Errore di registrazione",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante la registrazione."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Log in first to ensure we have a valid session
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw new Error("Errore durante il login dopo la registrazione");
      
      // Add a delay to ensure the authentication token has propagated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create the restaurant
      const restaurant = await createRestaurant(restaurantName, subdomain);
      if (!restaurant) throw new Error("Impossibile creare il ristorante");
      
      toast({
        title: "Registrazione completata",
        description: "Il tuo ristorante è stato creato con successo.",
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Errore creazione ristorante:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante la creazione del ristorante."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sanitizeSubdomain = (value: string) => {
    // Replace spaces and special characters with hyphens, make lowercase
    return value.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubdomain(sanitizeSubdomain(e.target.value));
  };

  const handleRestaurantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setRestaurantName(name);
    // Auto-generate subdomain from restaurant name if subdomain is empty
    if (!subdomain) {
      setSubdomain(sanitizeSubdomain(name));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center dark:text-white">Gestione Menu Digitale</CardTitle>
          <CardDescription className="text-center dark:text-gray-400">
            Accedi o registrati per gestire il tuo menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Accedi</TabsTrigger>
              <TabsTrigger value="register">Registrati</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium dark:text-gray-300">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium dark:text-gray-300">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Accesso in corso..." : "Accedi"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              {registrationStep === 1 ? (
                <form onSubmit={handleRegistrationStep1} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="block text-sm font-medium dark:text-gray-300">
                      Email
                    </label>
                    <Input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tuo@email.com"
                      required
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="block text-sm font-medium dark:text-gray-300">
                      Password
                    </label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full"
                      minLength={6}
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Registrazione in corso..." : "Continua"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegistrationStep2} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="restaurant-name" className="block text-sm font-medium dark:text-gray-300">
                      Nome del ristorante
                    </label>
                    <Input
                      id="restaurant-name"
                      type="text"
                      value={restaurantName}
                      onChange={handleRestaurantNameChange}
                      placeholder="Trattoria Bella Italia"
                      required
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subdomain" className="block text-sm font-medium dark:text-gray-300">
                      Sottodominio
                    </label>
                    <div className="flex items-center">
                      <Input
                        id="subdomain"
                        type="text"
                        value={subdomain}
                        onChange={handleSubdomainChange}
                        placeholder="nome-ristorante"
                        required
                        className="w-full"
                        disabled={isLoading}
                      />
                      <span className="ml-2 text-muted-foreground">.menudigitale.app</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Questo sarà l'indirizzo web pubblico del tuo menu.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setRegistrationStep(1)} 
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Indietro
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creazione..." : "Crea ristorante"}
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Torna al menu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
