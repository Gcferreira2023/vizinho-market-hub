
import { createClient } from '@supabase/supabase-js';

// Esta função tenta estabelecer uma conexão com o Supabase e retorna o status
export const testSupabaseConnection = async () => {
  try {
    // Verificação explícita das variáveis de ambiente
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Log de diagnóstico (pode ser removido em produção)
    console.log('Testando conexão com Supabase...');
    console.log('VITE_SUPABASE_URL disponível:', !!supabaseUrl);
    console.log('VITE_SUPABASE_ANON_KEY disponível:', !!supabaseAnonKey);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('⚠️ As variáveis de ambiente do Supabase não estão configuradas');
      return { 
        success: false, 
        message: 'As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram encontradas. Você precisa configurar estas variáveis no painel do Lovable.'
      };
    }
    
    // Cria um cliente Supabase temporário para o teste
    const testClient = createClient(supabaseUrl, supabaseAnonKey);
    
    // Define um timeout para evitar espera infinita
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao tentar conectar ao Supabase')), 5000);
    });
    
    // Tenta fazer uma consulta simples para verificar a conexão
    const connectionPromise = testClient.auth.getSession();
    
    // Usa Promise.race para implementar o timeout
    const { error } = await Promise.race([
      connectionPromise,
      timeoutPromise.then(() => ({ data: null, error: new Error('Timeout ao tentar conectar ao Supabase') }))
    ]) as { data: any, error: Error | null };
    
    if (error) {
      console.error('Erro ao conectar ao Supabase:', error);
      return { 
        success: false, 
        message: `Erro na conexão: ${error.message}. Verifique sua conexão com a internet.` 
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
