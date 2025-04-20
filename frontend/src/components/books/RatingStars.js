import React from 'react';
import { FaStar } from 'react-icons/fa';

const RatingStars = ({ rating = 0, size = 'sm', interactive = false, onRatingChange = null }) => {
  // Convert rating to a number and ensure it's between 0 and 5
  const numRating = Number(rating) || 0;
  const safeRating = Math.min(Math.max(numRating, 0), 5);
  
  // Determine star size based on prop
  const iconSize = size === 'lg' ? 24 : size === 'md' ? 20 : 16;
  
  // Simple handler without memoization to avoid re-render issues
  const handleStarClick = (value) => {
    if (interactive && onRatingChange) {
      console.log("Star clicked with value:", value);
      onRatingChange(value);
    }
  };

  // Create stars array for rendering
  const stars = [1, 2, 3, 4, 5].map((star) => (
    <span 
      key={star}
      onClick={() => handleStarClick(star)}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? `Rate ${star} stars` : undefined}
      style={{ 
        cursor: interactive ? 'pointer' : 'default',
        padding: '2px',
        margin: '0 1px',
        display: 'inline-block'
      }}
    >
      <FaStar 
        size={iconSize}
        color={star <= safeRating ? '#ffc107' : '#e4e5e9'}
      />
    </span>
  ));

  return (
    <div className="rating-stars d-inline-flex align-items-center">
      {stars}
    </div>
  );
};

export default RatingStars;