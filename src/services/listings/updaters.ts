
import { supabase } from "@/integrations/supabase/client";

// Atualizar dados do anúncio
export const updateListing = async (listingId: string, listingData: any) => {
  // Define the price as 0 if priceUponRequest is true
  const price = listingData.priceUponRequest ? 0 : parseFloat(listingData.price);
  
  const { error: updateError } = await supabase
    .from('ads')
    .update({
      title: listingData.title,
      description: listingData.description,
      price: price,
      category: listingData.category,
      type: listingData.type,
      availability: listingData.availability,
      delivery: listingData.delivery,
      delivery_fee: listingData.delivery ? parseFloat(listingData.deliveryFee) : null,
      payment_methods: listingData.paymentMethods,
      updated_at: new Date().toISOString(),
      price_upon_request: listingData.priceUponRequest,
    })
    .eq('id', listingId);
  
  if (updateError) throw updateError;
};

// Excluir anúncio
export const deleteListing = async (listingId: string) => {
  const { error } = await supabase
    .from('ads')
    .delete()
    .eq('id', listingId);
    
  if (error) throw error;
};
