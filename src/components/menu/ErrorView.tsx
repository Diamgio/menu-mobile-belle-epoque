
import React from "react";

const ErrorView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
      <div className="text-center px-4">
        <div className="mb-4 text-3xl font-bold text-red-600">Errore</div>
        <p className="text-xl dark:text-gray-400">Si è verificato un errore durante il caricamento del menu.</p>
      </div>
    </div>
  );
};

export default ErrorView;
