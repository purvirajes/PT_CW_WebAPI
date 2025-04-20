import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import RatingStars from '../books/RatingStars';

const ReviewForm = ({ 
  initialValues = { rating: 0, content: '' }, 
  onSubmit, 
  onCancel,
  isEditing = false 
}) => {
  // Use separate state for rating and content to avoid rendering issues
  const [rating, setRating] = useState(initialValues.rating || 0);
  const [content, setContent] = useState(initialValues.content || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Handle rating change 
  const handleRatingChange = (newRating) => {
    console.log("Rating changed to:", newRating);
    setRating(newRating);
  };

  // Handle content change - direct assignment
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter your review');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // Use plain object for submission
      const reviewData = { rating, content };
      console.log("Submitting review:", reviewData);
      
      const success = await onSubmit(reviewData);
      
      if (!success) {
        setError('Failed to submit review. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="mb-3">
        <Form.Label>Rating</Form.Label>
        <div>
          <RatingStars 
            rating={rating} 
            size="lg" 
            interactive={true} 
            onRatingChange={handleRatingChange} 
          />
          <span className="ms-2">
            {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
          </span>
        </div>
      </div>
      
      <Form.Group className="mb-3">
        <Form.Label>Your Review</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={content}
          onChange={handleContentChange}
          placeholder="Share your thoughts about this book..."
        />
      </Form.Group>
      
      <div className="d-flex justify-content-end gap-2">
        <Button 
          type="button" 
          variant="outline-secondary" 
          onClick={handleCancel} 
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting 
            ? (isEditing ? 'Updating...' : 'Submitting...') 
            : (isEditing ? 'Update Review' : 'Submit Review')}
        </Button>
      </div>
    </Form>
  );
};

export default ReviewForm;