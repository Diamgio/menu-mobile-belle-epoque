
import { useState, useEffect } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const OfflineAlert = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Event listeners for online/offline status changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <Alert variant="destructive" className="fixed bottom-16 left-0 right-0 mx-4 z-50">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>Connessione assente</AlertTitle>
      <AlertDescription>
        Sei in modalità offline. Alcune funzionalità potrebbero non essere disponibili.
      </AlertDescription>
    </Alert>
  );
};

export default OfflineAlert;
