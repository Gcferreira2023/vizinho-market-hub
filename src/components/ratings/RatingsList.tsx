
import { useEffect, useState } from 'react';
import { Rating } from '@/types/rating';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import UserRatingDisplay from './UserRatingDisplay';
import { Card, CardContent } from '@/components/ui/card';

interface RatingsListProps {
  userId: string;
  limit?: number;
  showAllRatings?: boolean;
}

const RatingsList = ({ userId, limit = 5, showAllRatings = false }: RatingsListProps) => {
  const [ratings, setRatings] = useState<(Rating & { reviewer_name?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchRatings = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('ratings')
          .select('*')
          .eq('rated_user_id', userId)
          .order('created_at', { ascending: false });

        if (!showAllRatings && limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        
        // Buscar nomes dos avaliadores
        const reviewerIds = [...new Set(data.map(item => item.reviewer_id))];
        
        if (reviewerIds.length > 0) {
          // Vamos usar um método mais simples para obter informações do usuário
          // de forma correta usando a tabela users que existe no schema
          const usersPromises = reviewerIds.map(async (id) => {
            const { data: userData } = await supabase
              .from('users')
              .select('id, name')
              .eq('id', id)
              .single();
              
            return userData;
          });
          
          const usersData = await Promise.all(usersPromises);
          
          const userMap = new Map();
          usersData.forEach(user => {
            if (user) {
              userMap.set(user.id, user.name || 'Usuário');
            }
          });
          
          const ratingsWithNames = data.map(rating => ({
            ...rating,
            reviewer_name: userMap.get(rating.reviewer_id) || 'Usuário'
          }));
          
          setRatings(ratingsWithNames);
        } else {
          setRatings(data as Rating[]);
        }
      } catch (err) {
        console.error('Erro ao buscar avaliações:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [userId, limit, showAllRatings]);

  if (isLoading) {
    return <div className="text-center py-4">Carregando avaliações...</div>;
  }

  if (ratings.length === 0) {
    return <div className="text-center py-4 text-gray-500">Este usuário ainda não recebeu avaliações.</div>;
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
    } catch (err) {
      return 'Data desconhecida';
    }
  };

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <Card key={rating.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{rating.reviewer_name || 'Usuário'}</p>
                <div className="my-1">
                  <UserRatingDisplay 
                    summary={{ average_rating: rating.rating, total_ratings: 1 }} 
                    showCount={false}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">{formatDate(rating.created_at)}</p>
            </div>
            {rating.comment && (
              <p className="mt-2 text-gray-700">{rating.comment}</p>
            )}
          </CardContent>
        </Card>
      ))}
      
      {!showAllRatings && ratings.length > limit && (
        <div className="text-center">
          <a href="#" className="text-primary hover:underline">Ver todas as avaliações</a>
        </div>
      )}
    </div>
  );
};

export default RatingsList;
