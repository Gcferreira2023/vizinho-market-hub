
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useSubmitRating } from '@/hooks/useSubmitRating';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RatingFormProps {
  ratedUserId: string;
  adId?: string;
  onSuccess?: () => void;
}

const RatingForm: React.FC<RatingFormProps> = ({
  ratedUserId,
  adId,
  onSuccess
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const { submitRating, isSubmitting, error, success } = useSubmitRating();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const success = await submitRating({
      reviewerId: user.id,
      ratedUserId,
      adId,
      rating,
      comment: comment.trim() || undefined
    });
    
    if (success && onSuccess) {
      onSuccess();
      // Reset do formulário
      setRating(0);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg border">
      <h3 className="text-lg font-medium">Avalie este usuário</h3>
      
      <div className="flex items-center">
        <div 
          className="flex space-x-1" 
          onMouseLeave={() => setHoveredRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              className="focus:outline-none"
            >
              <Star 
                className={`w-8 h-8 ${star <= (hoveredRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
              />
            </button>
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-500">
          {rating > 0 ? `${rating} estrela${rating !== 1 ? 's' : ''}` : 'Selecione uma avaliação'}
        </span>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Comentário (opcional)
        </label>
        <Textarea
          id="comment"
          rows={3}
          className="w-full"
          placeholder="Compartilhe sua experiência com este usuário..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      {success && (
        <div className="text-green-500 text-sm">Avaliação enviada com sucesso!</div>
      )}
      
      <Button
        type="submit"
        disabled={rating === 0 || isSubmitting || !user}
        className="w-full"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar avaliação'}
      </Button>
    </form>
  );
};

export default RatingForm;
