
import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';
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
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
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
