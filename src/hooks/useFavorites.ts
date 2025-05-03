
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface FavoriteItem {
  id: string;
  ad_id: string;
  user_id: string;
  created_at: string;
  ad?: {
    id: string;
    title: string;
    price: number;
    category: string;
    type: string;
    status: string;
    ad_images?: { image_url: string }[];
  };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          ad:ads(
            id, 
            title, 
            price, 
            category, 
            type, 
            status,
            ad_images(image_url)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data || []);
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível carregar os favoritos: ${error.message}`,
        variant: 'destructive',
      });
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const addFavorite = async (adId: string) => {
    if (!user) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para favoritar anúncios",
        variant: "warning"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          ad_id: adId
        });

      if (error) throw error;

      fetchFavorites();
      return true;
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível adicionar aos favoritos: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeFavorite = async (adId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('ad_id', adId);

      if (error) throw error;

      fetchFavorites();
      return true;
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível remover dos favoritos: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    favorites,
    isLoading,
    fetchFavorites,
    addFavorite,
    removeFavorite
  };
}
