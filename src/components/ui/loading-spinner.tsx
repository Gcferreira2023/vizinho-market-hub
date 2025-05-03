
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner = ({ message = "Carregando...", className = "" }: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <div className="animate-spin mr-2 mb-2">
        <Loader className="h-6 w-6" />
      </div>
      <span className="text-gray-600">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
