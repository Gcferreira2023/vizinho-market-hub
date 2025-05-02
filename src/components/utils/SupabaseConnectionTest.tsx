
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { testSupabaseConnection } from '@/utils/supabaseTest';
import { useToast } from '@/components/ui/use-toast';

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
    <div className="p-4 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold">Teste de Conexão Supabase</h2>
      
      <Button 
        onClick={checkConnection} 
        disabled={status.checking}
        variant="outline"
      >
        {status.checking ? "Verificando..." : "Verificar Conexão"}
      </Button>
      
      {status.message && (
        <div className={`p-3 rounded text-sm ${
          status.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

export default SupabaseConnectionTest;
