
import React from "react";
import ZoomableImage from "@/components/ZoomableImage";

interface LoadingViewProps {
  logoUrl: string;
  restaurantName: string;
}

const LoadingView = ({ logoUrl, restaurantName }: LoadingViewProps) => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
      <div className="mb-8 w-32 h-32 relative">
        <ZoomableImage
          src={logoUrl}
          alt={restaurantName}
          aspectRatio={1}
          showLoadingPlaceholder={false}
        />
      </div>
      <div className="text-center px-4">
        <div className="mb-4 text-3xl font-bold dark:text-white">Caricamento...</div>
        <p className="text-xl dark:text-gray-400">Stiamo caricando il menu del ristorante.</p>
      </div>
    </div>
  );
};

export default LoadingView;
