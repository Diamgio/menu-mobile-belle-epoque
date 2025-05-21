
import React from "react";

const ErrorView = () => {
  // No hooks used, so no risk of hook violations
  console.log("ErrorView rendering");
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
      <div className="text-center px-4">
        <div className="mb-4 text-3xl font-bold text-red-600">Errore</div>
        <p className="text-xl dark:text-gray-400">Si è verificato un errore durante il caricamento del menu.</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Ricarica
        </button>
      </div>
    </div>
  );
};

export default ErrorView;
