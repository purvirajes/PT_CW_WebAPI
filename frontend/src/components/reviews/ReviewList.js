import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import RatingStars from '../books/RatingStars';
import ReviewForm from './ReviewForm';

const ReviewList = ({ reviews, currentUser, onUpdateReview, onDeleteReview }) => {
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  //editing a review
  const handleEditClick = (reviewId) => {
    console.log("Starting to edit review:", reviewId);
    setEditingReviewId(reviewId);
    setError(null);
    setSuccessMessage(null);
  };

  //cancel editing
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setError(null);
  };

  // Submit updated review
  const handleUpdateSubmit = async (reviewId, reviewData) => {
    try {
      console.log("Submitting updated review:", reviewId, reviewData);
      
      const completeReviewData = {
        ...reviewData,
        userID: reviews.find(review => review.ID === reviewId)?.userID,
        bookID: reviews.find(review => review.ID === reviewId)?.bookID
      };
      
      console.log("Final review data to send:", completeReviewData);
      const success = await onUpdateReview(reviewId, completeReviewData);
      if (success) {
        setEditingReviewId(null);
        setError(null);
        setSuccessMessage("Review updated successfully");
      } else {
        setError('Failed to update review. Please try again.');
      }
      return success;
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error in review update:', err);
      return false;
    }
  };

  // Delete a review
  const handleDeleteClick = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        console.log("Deleting review:", reviewId);
        const success = await onDeleteReview(reviewId);
        if (success) {
          setSuccessMessage("Review deleted successfully");
        } else {
          setError('Failed to delete review. Please try again.');
        }
        return success;
      } catch (err) {
        setError('An error occurred. Please try again.');
        console.error('Error in review deletion:', err);
        return false;
      }
    }
  };

  // Check if user can edit a review (is author or admin)
  const canEditReview = (review) => {
    if (!currentUser) return false;
    
    console.log("Checking edit permissions:", {
      currentUserID: currentUser.ID,
      reviewUserID: review.userID,
      isAdmin: currentUser.role === 'admin'
    });
    
    return (
      currentUser.ID === review.userID || 
      currentUser.role === 'admin'
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (reviews.length === 0) {
    return (
      <Card.Body>
        <p className="text-center text-muted">No reviews yet. Be the first to review!</p>
      </Card.Body>
    );
  }

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>{successMessage}</Alert>}
      
      {reviews.map((review) => (
        <Card.Body key={review.ID} className="border-bottom">
          {editingReviewId === review.ID ? (
            <ReviewForm
              initialValues={{
                rating: review.rating,
                content: review.content
              }}
              onSubmit={(data) => handleUpdateSubmit(review.ID, data)}
              onCancel={handleCancelEdit}
              isEditing={true}
            />
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <RatingStars rating={review.rating} />
                  <h6 className="mt-2 mb-0">{review.username || 'Anonymous'}</h6>
                  <small className="text-muted">
                    {formatDate(review.createdAt)}
                    {review.updatedAt && review.updatedAt !== review.createdAt && 
                      ` (edited ${formatDate(review.updatedAt)})`}
                  </small>
                </div>
                
                {canEditReview(review) && (
                  <div className="d-flex">
                    <Button 
                      variant="link" 
                      className="text-primary p-0 me-2" 
                      onClick={() => handleEditClick(review.ID)}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="link" 
                      className="text-danger p-0" 
                      onClick={() => handleDeleteClick(review.ID)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                )}
              </div>
              
              <p className="mb-0">{review.content}</p>
            </>
          )}
        </Card.Body>
      ))}
    </div>
  );
};

export default ReviewList;