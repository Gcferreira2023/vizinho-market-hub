
import { createClient } from '@supabase/supabase-js';

// Esta função tenta estabelecer uma conexão com o Supabase e retorna o status
export const testSupabaseConnection = async () => {
  try {
    // Verificação explícita das variáveis de ambiente
    const supabaseUrl = "https://lqbhtvgpylngscpuqasb.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYmh0dmdweWxuZ3NjcHVxYXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTkxNDIsImV4cCI6MjA2MTc5NTE0Mn0.SgGj0eo4k7R0jhjBqnUuZvq2Qh6b9saTIzFx1XJKrTs";
    
    // Log de diagnóstico (pode ser removido em produção)
    console.log('Testando conexão com Supabase...');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('⚠️ As variáveis de ambiente do Supabase não estão configuradas');
      return { 
        success: false, 
        message: 'As variáveis de ambiente do Supabase não foram encontradas.'
      };
    }
    
    // Cria um cliente Supabase temporário para o teste
    const testClient = createClient(supabaseUrl, supabaseAnonKey);
    
    // Setup a timeout to avoid infinite waiting
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao tentar conectar ao Supabase')), 5000);
    });
    
    // Tenta fazer uma consulta simples para verificar a conexão
    const connectionPromise = testClient.from('states').select('count').maybeSingle();
    
    // Usa Promise.race para implementar o timeout
    const result = await Promise.race([
      connectionPromise,
      timeoutPromise
    ]);
    
    if (result.error) {
      console.error('Erro ao conectar ao Supabase:', result.error);
      return { 
        success: false, 
        message: `Erro na conexão: ${result.error.message}. Verifique sua conexão com a internet.` 
      };
    }

    // A conexão está funcionando
    console.log('Conexão com Supabase estabelecida com sucesso');
    return { success: true, message: 'Conexão com Supabase estabelecida com sucesso' };
  } catch (err) {
    console.error('Falha ao testar conexão com Supabase:', err);
    return { 
      success: false, 
      message: `Falha ao tentar conectar: ${err instanceof Error ? err.message : 'Erro desconhecido'}. Verifique sua conexão com a internet.` 
    };
  }
};
