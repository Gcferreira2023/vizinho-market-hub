
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const SupabaseConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const testConnection = async () => {
    setStatus('loading');
    
    if (!supabase) {
      setStatus('error');
      setErrorMessage('Cliente Supabase não inicializado. Verifique as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no painel do projeto Lovable.');
      return;
    }

    try {
  console.log('--- INÍCIO DO TESTE DE CONEXÃO ---');

  // Verifica se as variáveis do ambiente estão disponíveis
  console.log('URL disponível:', !!import.meta.env.VITE_SUPABASE_URL);
  console.log('ANON_KEY disponível:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

  // Tenta conectar ao Supabase
  console.log('Testando conexão com o Supabase...');
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Erro na conexão com o Supabase:', sessionError.message);
    throw new Error('Conexão com o Supabase falhou');
  }

  console.log('Conexão com Supabase bem-sucedida:', !!sessionData);
  setStatus('success');
  } catch (err: any) {
    console.error('Erro geral ao testar conexão:', err);
    setStatus('error');
    setErrorMessage(err instanceof Error ? err.message : 'Erro desconhecido ao testar conexão');
  } finally {
    console.log('--- FIM DO TESTE DE CONEXÃO ---');
  }

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-4 my-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Status da Conexão com Supabase</h2>
      
      {status === 'loading' && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle>Testando conexão...</AlertTitle>
          <AlertDescription>Verificando a conexão com Supabase</AlertDescription>
        </Alert>
      )}
      
      {status === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle>Conexão bem-sucedida!</AlertTitle>
          <AlertDescription>Seu aplicativo está conectado ao Supabase com sucesso.</AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert className="bg-red-50 border-red-200 mb-4">
          <AlertTitle>Erro na conexão</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="mt-4 p-4 bg-gray-50 rounded border">
        <h3 className="font-medium mb-2">Informações de diagnóstico:</h3>
        <p className="mb-1">VITE_SUPABASE_URL está configurado: {import.meta.env.VITE_SUPABASE_URL ? 'Sim' : 'Não'}</p>
        <p>VITE_SUPABASE_ANON_KEY está configurado: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Sim (valor oculto)' : 'Não'}</p>
      </div>
      
      <Button onClick={testConnection} className="mt-4">
        Testar Conexão Novamente
      </Button>
    </div>
  );
};

export default SupabaseConnectionTest;
