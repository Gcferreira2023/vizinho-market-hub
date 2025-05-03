
import { supabase } from "@/integrations/supabase/client";
import { AdInfo } from "@/types/messages";

export const fetchAdInfo = async (adId?: string): Promise<AdInfo | null> => {
  if (!adId) return null;
  
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('id, title, user_id')
      .eq('id', adId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao buscar informações do anúncio:", error);
    return null;
  }
};
