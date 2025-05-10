
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface RetryOptions {
  maxRetries?: number;
  onRetryAttempt?: () => void;
}

/**
 * Hook for managing retry logic with exponential backoff
 */
export function useRetry({ maxRetries = 3, onRetryAttempt }: RetryOptions = {}) {
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const handleError = (error: unknown) => {
    // Convert to Error type if needed
    const errorObject = error instanceof Error ? error : new Error(String(error));
    
    // Store the error for potential recovery
    setLastError(errorObject);
    
    // Check if we should retry
    const shouldRetry = retryCount < maxRetries;
    if (shouldRetry) {
      console.log(`Retrying (attempt ${retryCount + 1}/${maxRetries})...`);
      setRetryCount(prev => prev + 1);
      
      // Show retry toast
      toast({
        title: "Tentando novamente",
        description: "Estamos tentando atualizar os anúncios novamente",
        duration: 3000
      });
      
      if (onRetryAttempt) {
        onRetryAttempt();
      }
      
      return true; // Indicates a retry is happening
    } else {
      // We've exhausted retries, show error and reset
      toast({
        title: "Erro ao carregar anúncios",
        description: "Não foi possível carregar os anúncios. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
      setRetryCount(0);
      return false; // No more retries
    }
  };

  const resetError = () => {
    setLastError(null);
    setRetryCount(0);
  };

  // Function to manually trigger a retry
  const manualRetry = () => {
    if (lastError) {
      console.log("Manual retry requested by user");
      setRetryCount(1); // This will trigger the retry logic
      return true;
    }
    return false;
  };

  return {
    retryCount,
    lastError,
    handleError,
    resetError,
    manualRetry,
    hasError: lastError !== null
  };
}
