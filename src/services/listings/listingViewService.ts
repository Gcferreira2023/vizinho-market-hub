
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
    
    // Obter contagem atual
    const { data: currentData, error: fetchError } = await supabase
      .from('ads')
      .select('viewCount')
      .eq('id', listingId)
      .single();
      
    if (fetchError) {
      console.error('Erro ao buscar contagem de visualizações:', fetchError);
      return;
    }
    
    // Incrementar a contagem
    const currentCount = currentData?.viewCount || 0;
    const newCount = currentCount + 1;
    
    const { error: updateError } = await supabase
      .from('ads')
      .update({ viewCount: newCount })
      .eq('id', listingId);
      
    if (updateError) {
      console.error('Erro ao atualizar contagem de visualizações:', updateError);
    } else {
      console.log(`Visualização incrementada: ${listingId}, nova contagem: ${newCount}`);
    }
    
    return newCount;
  } catch (error) {
    console.error('Erro ao processar visualização:', error);
  }
};

/**
 * Obtém estatísticas de visualização para um anúncio
 */
export const getListingViewStats = async (listingId: string) => {
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('viewCount, created_at')
      .eq('id', listingId)
      .single();
      
    if (error) {
      console.error('Erro ao buscar estatísticas de visualização:', error);
      return { viewCount: 0, createdAt: null };
    }
    
    return {
      viewCount: data?.viewCount || 0,
      createdAt: data?.created_at || null
    };
  } catch (error) {
    console.error('Erro ao processar estatísticas de visualização:', error);
    return { viewCount: 0, createdAt: null };
  }
};
