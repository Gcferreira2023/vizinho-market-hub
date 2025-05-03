
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Componente para testar a conexão com o Supabase.
 * Ele tenta buscar dados da tabela de categorias para verificar se a conexão está funcionando.
 */
const SupabaseConnectionTest = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Tenta buscar dados da tabela de categorias
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(5);
      
      if (error) {
        throw error;
      }
      
      // Se chegou até aqui, a conexão está funcionando
      setIsConnected(true);
      setData(data);
      console.info("Conexão com Supabase funcionando! Dados:", data);
    } catch (err: any) {
      // Em caso de erro, marca como não conectado
      setIsConnected(false);
      setError(err.message || "Erro desconhecido ao conectar com Supabase");
      console.error("Erro na conexão com Supabase:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Testa a conexão automaticamente na primeira renderização
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Status da Conexão com Supabase</CardTitle>
        <CardDescription>
          Verifique se sua aplicação está conectada corretamente ao backend Supabase
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected === null ? (
          <p className="text-center text-gray-500">Verificando conexão...</p>
        ) : isConnected ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Conectado com sucesso!</AlertTitle>
            <AlertDescription className="text-green-700">
              Sua aplicação está conectada com o backend Supabase.
              {data && data.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Dados recuperados:</p>
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto max-h-32">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro de conexão</AlertTitle>
            <AlertDescription>
              Não foi possível conectar ao Supabase.
              {error && <div className="mt-1 text-sm font-mono">{error}</div>}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={testConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Testando..." : "Testar novamente"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseConnectionTest;
