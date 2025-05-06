
import { supabase } from "@/integrations/supabase/client";

/**
 * Incrementa o contador de visualizações de um anúncio
 * Implementa lógica para evitar contagem duplicada usando session storage
 */
export const incrementListingView = async (listingId: string) => {
  try {
    // Verificar se o anúncio já foi visualizado nesta sessão
    const viewedListingsStr = sessionStorage.getItem('viewed_listings') || '{}';
    const viewedListings = JSON.parse(viewedListingsStr);
    
    // Verificar se o anúncio foi visualizado recentemente
    const lastViewTime = viewedListings[listingId];
    const now = Date.now();
    
    // Se o anúncio foi visualizado nas últimas 4 horas, não incrementa
    if (lastViewTime && (now - lastViewTime < 4 * 60 * 60 * 1000)) {
      console.log('Anúncio já visualizado recentemente, não incrementando contador');
      return;
    }
    
    // Registrar a visualização atual
    viewedListings[listingId] = now;
    sessionStorage.setItem('viewed_listings', JSON.stringify(viewedListings));
    
    try {
      // Usar a função RPC para incrementar a visualização
      const { data, error } = await supabase.rpc('increment_ad_view', { ad_id: listingId });
      
      if (error) {
        console.error('Erro ao incrementar visualização via RPC:', error);
        
        // Fallback - atualizar diretamente se a RPC falhar
        const { error: updateError } = await supabase
          .from('ads')
          .update({ 
            view_count: 1,  // Começar com 1 se não existir
            updated_at: new Date().toISOString() 
          })
          .eq('id', listingId);
          
        if (updateError) {
          console.error('Erro ao atualizar dados do anúncio:', updateError);
        }
        
        return 1; // Retornar valor padrão em caso de erro
      }
      
      return data as number; // Retornar o contador atualizado da função RPC
      
    } catch (err) {
      console.error('Erro ao incrementar visualização:', err);
      return 0;
    }
  } catch (error) {
    console.error('Erro ao processar visualização:', error);
    return 0;
  }
};

/**
 * Obtém estatísticas de visualização para um anúncio
 */
export const getListingViewStats = async (listingId: string) => {
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('view_count, created_at')
      .eq('id', listingId)
      .single();
      
    if (error) {
      console.error('Erro ao buscar estatísticas de visualização:', error);
      return { viewCount: 0, createdAt: null };
    }
    
    return {
      viewCount: data?.view_count || 0,
      createdAt: data?.created_at || null
    };
  } catch (error) {
    console.error('Erro ao processar estatísticas de visualização:', error);
    return { viewCount: 0, createdAt: null };
  }
};
