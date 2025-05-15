
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Belle Èpoque - La Brasserie dal 1989 - Menu Mobile</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Gestisci il tuo menu di ristorante in modo semplice ed elegante, accessibile da qualsiasi dispositivo.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            Visualizza Menu
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/admin")}
            className="w-full sm:w-auto"
          >
            Area Amministrativa
          </Button>
        </div>
        
        <div className="mt-12 p-4 bg-background rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Funzionalità PWA</h2>
          <p className="text-muted-foreground text-sm">
            Questa applicazione può essere installata sul tuo dispositivo come una app nativa.
            Per installarla, usa l'opzione "Aggiungi alla schermata Home" nel tuo browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
