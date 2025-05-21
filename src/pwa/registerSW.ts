
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  }
}

export function checkForAppInstallation() {
  // Store the install prompt event
  let deferredPrompt: any;
  
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Store the event for later use
    deferredPrompt = e;
    
    // Optionally, notify the user the app can be installed
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';
      
      installButton.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        
        // We've used the prompt, and can't use it again, so clear it
        deferredPrompt = null;
        
        // Hide the install button
        installButton.style.display = 'none';
      });
    }
  });
  
  // Listen for app installed event
  window.addEventListener('appinstalled', (evt) => {
    console.log('Application was installed', evt);
  });
}
