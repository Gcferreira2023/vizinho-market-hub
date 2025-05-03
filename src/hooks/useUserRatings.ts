
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Rating, UserRatingSummary } from '@/types/rating';

export const useUserRatings = (userId: string | undefined) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [summary, setSummary] = useState<UserRatingSummary>({ average_rating: 0, total_ratings: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchRatings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Buscar avaliações
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('ratings')
          .select('*')
          .eq('rated_user_id', userId)
          .order('created_at', { ascending: false });
          
        if (ratingsError) throw ratingsError;
        
        // Calcular média e total
        const ratingValues = ratingsData.map(r => r.rating);
        const average = ratingValues.length > 0 
          ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length 
          : 0;
          
        setRatings(ratingsData as Rating[]);
        setSummary({
          average_rating: parseFloat(average.toFixed(1)),
          total_ratings: ratingsData.length
        });
      } catch (err: any) {
        console.error('Erro ao buscar avaliações:', err);
        setError('Não foi possível carregar as avaliações');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [userId]);

  return { ratings, summary, isLoading, error };
};
