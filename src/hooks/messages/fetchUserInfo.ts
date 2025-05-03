
import { supabase } from "@/integrations/supabase/client";
import { UserInfo } from "@/types/messages";

export const fetchUserInfo = async (userId: string): Promise<UserInfo | null> => {
  try {
    // Note: This should be adjusted if your Supabase auth setup is different
    const { data, error } = await supabase
      .auth.admin.getUserById(userId);
      
    if (error) throw error;
    
    return {
      id: data.user.id,
      name: data.user.user_metadata?.full_name || "Usuário",
    };
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    return null;
  }
};
