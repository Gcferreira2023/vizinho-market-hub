
import { createClient } from '@supabase/supabase-js';

// Esta função tenta estabelecer uma conexão com o Supabase e retorna o status
export const testSupabaseConnection = async () => {
  try {
    // Se você já configurou a integração com Supabase, as variáveis de ambiente
    // já devem estar disponíveis no ambiente da Lovable
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('As variáveis de ambiente do Supabase não estão configuradas');
      return { success: false, message: 'Variáveis de ambiente não encontradas' };
    }
    
    // Cria um cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Tenta fazer uma consulta simples para verificar a conexão
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1).maybeSingle();
    
    if (error && error.message !== 'relation "_test_connection" does not exist') {
      // Se o erro não for relacionado à tabela não existir, há um problema de conexão
      console.error('Erro ao conectar ao Supabase:', error);
      return { success: false, message: `Erro na conexão: ${error.message}` };
    }

    // A tabela pode não existir, mas a conexão está funcionando
    return { success: true, message: 'Conexão com Supabase estabelecida com sucesso' };
  } catch (err) {
    console.error('Falha ao testar conexão com Supabase:', err);
    return { 
      success: false, 
      message: `Falha ao tentar conectar: ${err instanceof Error ? err.message : 'Erro desconhecido'}` 
    };
  }
};
