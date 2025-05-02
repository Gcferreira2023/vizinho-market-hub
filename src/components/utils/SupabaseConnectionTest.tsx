
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { testSupabaseConnection } from '@/utils/supabaseTest';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const SupabaseConnectionTest = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<{
    checking: boolean;
    success?: boolean;
    message?: string;
  }>({ checking: false });

  const checkConnection = async () => {
    setStatus({ checking: true });
    const result = await testSupabaseConnection();
    
    setStatus({
      checking: false,
      success: result.success,
      message: result.message
    });

    toast({
      title: result.success ? "Conexão estabelecida" : "Falha na conexão",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teste de Conexão Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm font-medium mb-1">Status das Variáveis de Ambiente:</p>
            <div className="text-sm">
              <p className="flex items-center">
                <span className="mr-2">VITE_SUPABASE_URL:</span>
                {import.meta.env.VITE_SUPABASE_URL ? 
                  <CheckCircle size={16} className="text-green-500" /> : 
                  <AlertCircle size={16} className="text-red-500" />
                }
              </p>
              <p className="flex items-center">
                <span className="mr-2">VITE_SUPABASE_ANON_KEY:</span>
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? 
                  <CheckCircle size={16} className="text-green-500" /> : 
                  <AlertCircle size={16} className="text-red-500" />
                }
              </p>
            </div>
          </div>
          
          <Button 
            onClick={checkConnection} 
            disabled={status.checking}
            className="w-full"
          >
            {status.checking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : "Verificar Conexão"}
          </Button>
          
          {status.message && (
            <Alert variant={status.success ? "default" : "destructive"}>
              <AlertTitle>
                {status.success ? "Conexão bem-sucedida" : "Erro de conexão"}
              </AlertTitle>
              <AlertDescription>
                {status.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionTest;
