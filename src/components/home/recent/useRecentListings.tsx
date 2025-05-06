
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ListingStatus } from '@/components/listings/StatusBadge';

// Dados de exemplo para quando não há anúncios reais
const mockListings = [
  {
    id: 'mock1',
    title: 'Bolo de Chocolate Caseiro',
    price: 35.90,
    imageUrl: '/placeholder.svg',
    category: 'Alimentos',
    type: 'produto',
    rating: 4.8,
    location: 'Bloco A, 101',
    status: 'disponível' as ListingStatus,
    condominiumName: 'Condomínio Recanto Verde',
    isUserCondominium: false
  },
  {
    id: 'mock2',
    title: 'Serviço de Passeio com Pets',
    price: 'A combinar',
    imageUrl: '/placeholder.svg',
    category: 'Serviços',
    type: 'serviço',
    rating: 4.5,
    location: 'Bloco B, 304',
    status: 'disponível' as ListingStatus,
    condominiumName: 'Condomínio Solar das Paineiras',
    isUserCondominium: false
  },
  {
    id: 'mock3',
    title: 'Fones de Ouvido Bluetooth - Seminovo',
    price: 120.00,
    imageUrl: '/placeholder.svg',
    category: 'Produtos Gerais',
    type: 'produto',
    rating: 4.2,
    location: 'Bloco C, 202',
    status: 'disponível' as ListingStatus,
    condominiumName: 'Condomínio Parque das Flores',
    isUserCondominium: false
  },
  {
    id: 'mock4',
    title: 'Aulas de Inglês Online',
    price: 50.00,
    imageUrl: '/placeholder.svg',
    category: 'Serviços',
    type: 'serviço',
    rating: 5.0,
    location: 'Bloco D, 405',
    status: 'disponível' as ListingStatus,
    condominiumName: 'Condomínio Jardim das Acácias',
    isUserCondominium: false
  }
];

export const useRecentListings = () => {
  const [realListings, setRealListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [combinedListings, setCombinedListings] = useState<any[]>([]);
  const [showIllustrativeMessage, setShowIllustrativeMessage] = useState(false);
  const { user } = useAuth();
  
  // Buscar anúncios reais do banco de dados
  useEffect(() => {
    const fetchRealListings = async () => {
      try {
        setIsLoading(true);
        
        // Fetch real listings from database
        const { data, error } = await supabase
          .from('ads')
          .select(`
            *,
            ad_images(*),
            users(name, block, apartment),
            condominiums(name, city_id)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (error) {
          console.error('Error fetching recent listings:', error);
          throw error;
        }
        
        console.log("Recent listings raw data:", data);
        
        // Get user condominium ID para marcar quais anúncios são do mesmo condomínio
        const userCondominiumId = user?.user_metadata?.condominiumId;
        
        // Transformar dados para corresponder ao formato esperado pelo componente
        const transformedData = data?.map(item => {
          // Determinar a URL da imagem
          let imageUrl = '/placeholder.svg';
          
          // Verificar se há imagens associadas ao anúncio
          if (item.ad_images && item.ad_images.length > 0) {
            // Encontrar a primeira imagem válida
            for (const image of item.ad_images) {
              if (image.image_url && image.image_url.trim() !== '') {
                imageUrl = image.image_url;
                console.log(`Found valid image for listing ${item.id}:`, imageUrl);
                break;
              }
            }
            
            // Se nenhuma imagem válida for encontrada, usar placeholder
            if (imageUrl === '/placeholder.svg') {
              console.log(`No valid image found for listing ${item.id}, using placeholder`);
            }
          } else {
            console.log(`No images found for listing ${item.id}, using placeholder`);
          }
            
          return {
            id: item.id,
            title: item.title,
            price: item.price,
            imageUrl: imageUrl,
            category: item.category,
            type: item.type,
            location: item.users ? `${item.users.block || ''} ${item.users.apartment || ''}`.trim() : '',
            status: 'disponível' as ListingStatus,
            viewCount: item.view_count || 0,
            condominiums: item.condominiums,
            condominiumName: item.condominiums?.name || "Condomínio",
            isUserCondominium: item.condominium_id === userCondominiumId
          };
        }) || [];
        
        console.log("Recent listings transformed data:", transformedData);
        
        // Log das URLs de imagem para debug
        transformedData.forEach(listing => {
          console.log(`Listing ${listing.id} final image URL: ${listing.imageUrl}`);
        });
        
        setRealListings(transformedData);
        
        // Se temos anúncios reais, usá-los, caso contrário, usar dados de exemplo
        if (transformedData.length > 0) {
          setCombinedListings(transformedData);
          setShowIllustrativeMessage(false);
        } else {
          setCombinedListings(mockListings);
          setShowIllustrativeMessage(true);
        }
      } catch (err) {
        console.error("Error in fetchRealListings:", err);
        setCombinedListings(mockListings);
        setShowIllustrativeMessage(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRealListings();
  }, [user]);
  
  return {
    realListings,
    combinedListings,
    isLoading,
    showIllustrativeMessage
  };
};
