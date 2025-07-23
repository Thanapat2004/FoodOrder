import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

export default function StarRating({ 
    rating = 0, 
    maxRating = 5, 
    size = 'w-5 h-5', 
    interactive = false, 
    onStarClick = null,
    className = ''
}) {
    return (
        <div className={`flex space-x-1 ${className}`}>
            {[...Array(maxRating)].map((_, index) => {
                const filled = index < rating;
                const StarComponent = filled ? StarIcon : StarOutlineIcon;
                
                return (
                    <StarComponent
                        key={index}
                        className={`${size} ${filled ? 'text-yellow-400' : 'text-gray-300'} ${
                            interactive ? 'cursor-pointer hover:text-yellow-300 transition-colors' : ''
                        }`}
                        onClick={interactive && onStarClick ? () => onStarClick(index + 1) : undefined}
                    />
                );
            })}
        </div>
    );
}
