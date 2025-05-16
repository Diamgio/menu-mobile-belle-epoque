
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold">Menu Digitale</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin")}
            >
              Accedi / Registrati
            </Button>
          </div>
        </header>
        
        <main>
          <section className="py-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-5xl font-bold mb-6">Menu Digitale per il tuo Ristorante</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Crea un menu digitale elegante e accessibile per il tuo ristorante in pochi minuti.
                Aggiorna i piatti in tempo reale e condividi con i tuoi clienti tramite QR code.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/admin")}
                className="px-8 py-6 text-lg"
              >
                Inizia ora - €19/mese
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>Facile da Gestire</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Interfaccia semplice e intuitiva per aggiungere, modificare e rimuovere piatti dal tuo menu in pochi clic.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Menu Digitale Elegante</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Design responsive che si adatta a qualsiasi dispositivo. I tuoi clienti possono navigare facilmente tra le categorie.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gestione Allergie</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Indica gli allergeni presenti nei tuoi piatti per garantire un'esperienza sicura per tutti i tuoi clienti.</p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section className="py-12 bg-card rounded-xl p-8 mt-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Piano di Abbonamento</h2>
              <p className="text-muted-foreground">Un solo piano, tutto incluso, nessun limite.</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <Card className="border-primary">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Menu Digitale</CardTitle>
                  <div className="mt-4 mb-2">
                    <span className="text-4xl font-bold">€19</span>
                    <span className="text-muted-foreground">/mese</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Menu digitale con QR code</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Caricamento illimitato di piatti</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Personalizzazione logo e dati del ristorante</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Gestione allergie e categorie</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Supporto tecnico</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>URL personalizzato per il tuo menu</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate("/admin")}
                  >
                    Inizia ora
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
          
          <section className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Come Funziona</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Registrati</h3>
                <p className="text-muted-foreground">Crea un account e configura il tuo ristorante in pochi minuti.</p>
              </div>
              
              <div>
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Crea il Menu</h3>
                <p className="text-muted-foreground">Aggiungi i tuoi piatti, categorie e dettagli del ristorante.</p>
              </div>
              
              <div>
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Condividi</h3>
                <p className="text-muted-foreground">Condividi il tuo menu digitale con i clienti tramite QR code o link.</p>
              </div>
            </div>
            
            <Button 
              size="lg" 
              onClick={() => navigate("/admin")}
              className="mt-12"
            >
              Prova gratis per 7 giorni
            </Button>
          </section>
        </main>
        
        <footer className="border-t mt-16 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Menu Digitale. Tutti i diritti riservati.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
