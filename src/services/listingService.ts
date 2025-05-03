
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ListingFormData } from "@/types/listing";
import { ensureStorageBucket as utilsEnsureStorageBucket } from "@/utils/storageUtils";

// Buscar dados de um anúncio
export const fetchListing = async (listingId: string) => {
  const { data: adData, error: adError } = await supabase
    .from('ads')
    .select('*')
    .eq('id', listingId)
    .single();
    
  if (adError) throw adError;
  
  return adData;
};

// Verificar se o anúncio pertence ao usuário
export const checkListingOwnership = (adData: any, userId: string) => {
  return adData.user_id === userId;
};

// Buscar imagens de um anúncio
export const fetchListingImages = async (listingId: string) => {
  const { data: imageData, error: imageError } = await supabase
    .from('ad_images')
    .select('*')
    .eq('ad_id', listingId)
    .order('position');
    
  if (imageError) throw imageError;
  
  return imageData || [];
};

// Atualizar dados do anúncio
export const updateListing = async (listingId: string, listingData: any) => {
  const { error: updateError } = await supabase
    .from('ads')
    .update({
      title: listingData.title,
      description: listingData.description,
      price: parseFloat(listingData.price),
      category: listingData.category,
      type: listingData.type,
      availability: listingData.availability,
      delivery: listingData.delivery,
      delivery_fee: listingData.delivery ? parseFloat(listingData.deliveryFee) : null,
      payment_methods: listingData.paymentMethods,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listingId);
  
  if (updateError) throw updateError;
};

// Excluir imagens que foram removidas
export const deleteRemovedImages = async (listingId: string, existingImageIds: string[]) => {
  const { error: deleteImagesError } = await supabase
    .from('ad_images')
    .delete()
    .eq('ad_id', listingId)
    .not('id', 'in', existingImageIds.length > 0 ? `(${existingImageIds.join(',')})` : '(-1)');
  
  if (deleteImagesError) throw deleteImagesError;
};

// Fazer upload de uma nova imagem
export const uploadImage = async (file: File, listingId: string, userId: string, position: number) => {
  try {
    // Verificar se o bucket existe
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'ads');
    
    if (!bucketExists) {
      throw new Error("O bucket de armazenamento 'ads' não está disponível");
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}-${position}.${fileExt}`;
    const filePath = `ad-images/${listingId}/${fileName}`;
    
    // Upload da imagem
    const { error: uploadError } = await supabase
      .storage
      .from('ads')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Obter URL pública
    const { data: urlData } = supabase
      .storage
      .from('ads')
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
};

// Salvar referência da imagem no banco
export const saveImageReference = async (listingId: string, imageUrl: string, position: number) => {
  const { error: imageError } = await supabase
    .from('ad_images')
    .insert({
      ad_id: listingId,
      image_url: imageUrl,
      position: position,
    });
    
  if (imageError) throw imageError;
};

// Excluir anúncio
export const deleteListing = async (listingId: string) => {
  const { error } = await supabase
    .from('ads')
    .delete()
    .eq('id', listingId);
    
  if (error) throw error;
};

// Verificar se o bucket existe
export const checkStorageBucket = async (): Promise<boolean> => {
  console.log("Verificando se o bucket 'ads' existe...");
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Erro ao verificar buckets:", error);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'ads');
    console.log("Bucket 'ads' existe:", bucketExists);
    return bucketExists;
  } catch (error) {
    console.error("Erro ao verificar bucket:", error);
    return false;
  }
};

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
      });
    
    if (createUserError) {
      console.error("Erro detalhado ao criar perfil de usuário:", createUserError);
      throw new Error(`Erro ao criar perfil de usuário: ${createUserError.message}`);
    }
    
    console.log("Usuário criado com sucesso na tabela users");
  }

  return user.id;
};

// Criar um novo anúncio
export const createListing = async (formData: ListingFormData, userId: string): Promise<string> => {
  console.log("Inserindo anúncio com user_id:", userId);
  
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

// Upload e salvar múltiplas imagens para um anúncio
export const uploadListingImages = async (images: File[], listingId: string, userId: string) => {
  // Verifica se tem acesso ao storage
  const hasStorageAccess = await checkStorageBucket();
  
  if (!hasStorageAccess) {
    console.warn("Bucket de armazenamento não está acessível. Pulando upload de imagens.");
    throw new Error("Não foi possível acessar o armazenamento de imagens. O anúncio foi criado, mas sem imagens.");
  }
  
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    console.log(`Enviando imagem ${i+1}/${images.length}`);
    
    try {
      // Upload da imagem
      const publicUrl = await uploadImage(file, listingId, userId, i);
      console.log("URL pública da imagem:", publicUrl);
      
      // Salvar referência da imagem
      await saveImageReference(listingId, publicUrl, i);
    } catch (error) {
      console.error(`Erro ao processar imagem ${i+1}:`, error);
      throw error;
    }
  }
};
