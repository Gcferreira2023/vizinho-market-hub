
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, ImageOff } from "lucide-react";

interface ImageLoadingStateProps {
  isLoaded: boolean;
}

export const ImageLoadingState = ({ isLoaded }: ImageLoadingStateProps) => {
  if (isLoaded) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
      <Skeleton className="w-full h-full absolute" />
      <ImageIcon className="h-8 w-8 text-gray-400" />
    </div>
  );
};

interface ImageErrorStateProps {
  hasError: boolean;
}

export const ImageErrorState = ({ hasError }: ImageErrorStateProps) => {
  if (!hasError) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
      <div className="bg-background/80 p-3 rounded-full shadow-sm">
        <ImageOff className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  );
};
