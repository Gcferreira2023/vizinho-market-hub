
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  title: string;
  message: string;
  variant?: 'default' | 'destructive' | 'warning';
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay = ({
  title,
  message,
  variant = 'destructive',
  onRetry,
  className = ''
}: ErrorDisplayProps) => {
  return (
    <Alert variant={variant} className={`animate-in fade-in duration-300 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-sm">{title}</AlertTitle>
      <AlertDescription className="mt-1">
        <p className="text-xs">{message}</p>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 text-xs py-1 h-7" 
            onClick={onRetry}
          >
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
