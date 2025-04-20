// permissions/reviews.js
module.exports = {
  // Check if user can create a review (any logged-in user can create a review)
  create: (currentUser) => {
    return { granted: currentUser.role !== 'guest' };  // Any non-guest user can create a review
  },

  // Check if user can update a review (users can update their own review, admins can update any review)
  update: (currentUser, review) => {
    if (currentUser.role === 'admin') {
      return { granted: true };  // Admins can update any review
    }
    if (currentUser.id === review.userID) {
      return { granted: true };  // Users can only update their own reviews
    }
    return { granted: false };
  },

  // Check if user can delete a review (users can delete their own reviews, admins can delete any review)
  delete: (currentUser, review) => {
    if (currentUser.role === 'admin') {
      return { granted: true };  // Admins can delete any review
    }
    if (currentUser.id === review.userID) {
      return { granted: true };  // Users can delete their own reviews
    }
    return { granted: false };
  }
};
