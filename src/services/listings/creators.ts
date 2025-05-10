
import { supabase } from "@/integrations/supabase/client";
import { ListingFormData } from "@/types/listing";

// Criar um novo anúncio
export const createListing = async (formData: ListingFormData, userId: string): Promise<string> => {
  console.log("Inserindo anúncio com user_id:", userId);
  
  // Buscar o condomínio do usuário
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('condominium_id')
    .eq('id', userId)
    .single();
    
  if (userError) {
    console.error("Erro ao buscar dados do usuário:", userError);
    throw userError;
  }
  
  const condominiumId = userData?.condominium_id;
  
  const { data: adData, error: adError } = await supabase
    .from('ads')
    .insert({
      user_id: userId,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      type: formData.type,
      availability: formData.availability,
      delivery: formData.delivery,
      delivery_fee: formData.delivery ? parseFloat(formData.deliveryFee) : null,
      payment_methods: formData.paymentMethods,
      condominium_id: condominiumId,
    })
    .select('id')
    .single();
  
  if (adError) {
    console.error("Erro ao inserir anúncio:", adError);
    throw adError;
  }
  
  console.log("Anúncio criado com ID:", adData.id);
  return adData.id;
};
