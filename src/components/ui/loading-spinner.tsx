
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner = ({ 
  message = "Carregando...", 
  className = "",
  size = "md" 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  
  return (
    <div className={`flex flex-col items-center justify-center py-4 ${className}`}>
      <div className="animate-spin mr-2 mb-2">
        <Loader className={sizeClasses[size]} />
      </div>
      {message && (
        <span className="text-gray-600 text-sm text-center">{message}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
