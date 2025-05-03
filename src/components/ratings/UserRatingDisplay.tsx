
import React from 'react';
import { Star } from 'lucide-react';
import { UserRatingSummary } from '@/types/rating';

interface UserRatingDisplayProps {
  summary: UserRatingSummary;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
  onClick?: () => void;
}

const UserRatingDisplay: React.FC<UserRatingDisplayProps> = ({
  summary,
  size = 'md',
  showCount = true,
  className = '',
  onClick
}) => {
  const { average_rating, total_ratings } = summary;
  
  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => {
      // Calcular o preenchimento da estrela (vazia, metade, cheia)
      const filled = i < Math.floor(average_rating);
      
      return (
        <Star 
          key={i} 
          className={`${starSizes[size]} ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      );
    });
  };
  
  return (
    <div className={`flex items-center ${className}`} onClick={onClick} role={onClick ? "button" : undefined}>
      <div className="flex">
        {renderStars()}
      </div>
      
      {showCount && (
        <span className={`ml-2 text-gray-600 ${textSizes[size]}`}>
          {average_rating > 0 ? average_rating.toFixed(1) : '—'} 
          {total_ratings > 0 && ` (${total_ratings})`}
        </span>
      )}
    </div>
  );
};

export default UserRatingDisplay;
