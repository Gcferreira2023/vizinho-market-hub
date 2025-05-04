
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// Verificar se o usuário existe e criar se necessário
export const ensureUserExists = async (user: User): Promise<string> => {
  // Ensure we have a valid user ID before proceeding
  if (!user.id) {
    throw new Error("ID do usuário não disponível. Por favor, faça login novamente.");
  }

  // First check if user exists in the users table
  const { data: existingUser, error: userCheckError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();
  
  console.log("Verificando usuário existente:", existingUser, userCheckError);
  
  // If user doesn't exist in the users table, create them
  if (userCheckError || !existingUser) {
    // Get user metadata from auth
    const userMeta = user.user_metadata || {};
    console.log("Metadados do usuário:", userMeta);
    
    // Insert the user into the users table
    const { error: createUserError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email || '',
        name: userMeta.full_name || user.email?.split('@')[0] || 'Usuário',
        password_hash: 'managed-by-auth', // Just a placeholder as password is managed by Auth
        apartment: userMeta.apartment || null,
        block: userMeta.block || null,
        phone: userMeta.phone || null,
        condominium_id: userMeta.condominiumId || null,
      });
    
    if (createUserError) {
      console.error("Erro detalhado ao criar perfil de usuário:", createUserError);
      throw new Error(`Erro ao criar perfil de usuário: ${createUserError.message}`);
    }
    
    console.log("Usuário criado com sucesso na tabela users");
  }

  return user.id;
};

// Verificar se o anúncio pertence ao usuário
export const checkListingOwnership = (adData: any, userId: string) => {
  return adData.user_id === userId;
};
