
import React from "react";
import { ImageOff } from "lucide-react";

interface ImageErrorStateProps {
  isVisible: boolean;
}

export const ImageErrorState = ({ isVisible }: ImageErrorStateProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
      <div className="bg-background/80 p-3 rounded-full shadow-sm">
        <ImageOff className="w-8 h-8 text-muted-foreground" />
      </div>
    </div>
  );
};

export default ImageErrorState;
