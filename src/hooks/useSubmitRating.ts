
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface SubmitRatingParams {
  reviewerId: string;
  ratedUserId: string;
  adId?: string;
  rating: number;
  comment?: string;
}

export const useSubmitRating = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitRating = async ({ reviewerId, ratedUserId, adId, rating, comment }: SubmitRatingParams) => {
    if (reviewerId === ratedUserId) {
      setError('Você não pode avaliar a si mesmo');
      toast.error('Você não pode avaliar a si mesmo');
      return false;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Verificar se já existe uma avaliação
      const { data: existingRating } = await supabase
        .from('ratings')
        .select('id')
        .eq('reviewer_id', reviewerId)
        .eq('rated_user_id', ratedUserId)
        .eq('ad_id', adId || null)
        .maybeSingle();
      
      if (existingRating) {
        // Atualizar avaliação existente
        const { error: updateError } = await supabase
          .from('ratings')
          .update({
            rating,
            comment,
            created_at: new Date().toISOString()
          })
          .eq('id', existingRating.id);
          
        if (updateError) throw updateError;
        
        toast.success('Avaliação atualizada com sucesso!');
      } else {
        // Criar nova avaliação
        const { error: insertError } = await supabase
          .from('ratings')
          .insert({
            reviewer_id: reviewerId,
            rated_user_id: ratedUserId,
            ad_id: adId || null,
            rating,
            comment
          });
          
        if (insertError) throw insertError;
        
        toast.success('Avaliação enviada com sucesso!');
      }
      
      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error('Erro ao enviar avaliação:', err);
      setError('Não foi possível enviar sua avaliação');
      toast.error('Não foi possível enviar sua avaliação');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitRating, isSubmitting, error, success };
};
