
import React from "react";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageLoadingStateProps {
  isVisible: boolean;
}

export const ImageLoadingState = ({ isVisible }: ImageLoadingStateProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted">
      <Skeleton className="w-full h-full absolute" />
      <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50 z-10" />
    </div>
  );
};

export default ImageLoadingState;
