import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: number;
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = 16,
  showText = true,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-stone-300'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="text-sm font-semibold text-stone-700">
          {rating.toFixed(1)}
          {count !== undefined && (
            <span className="text-stone-400 font-normal ml-1">({count})</span>
          )}
        </span>
      )}
    </div>
  );
};
