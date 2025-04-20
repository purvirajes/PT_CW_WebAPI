const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const reviews = require('../models/reviews'); // Reviews model for database interaction
const auth = require('../middleware/auth'); // Auth middleware to ensure only authorized access
const { validateReview } = require('../controllers/validation'); // Validation for review data

const router = new Router({ prefix: '/api/v1/books' });

//routes for CRUD operations
router.get('/:id/reviews', getAllReviews); // Get all reviews for a book
router.get('/:id/reviews/:reviewId', getReviewById); // Get review by ID
router.post('/:id/reviews', auth, bodyParser(), validateReview, createReview); // Create a review
router.put('/:id/reviews/:reviewId', auth, bodyParser(), validateReview, updateReview); // Update review
router.del('/:id/reviews/:reviewId', auth, deleteReview); // Delete review

//route to get average rating for a book
router.get('/:id/average-rating', getAverageRating); // Get the average rating for a book


//handlers for CRUD operations

//get all reviews for a book
async function getAllReviews(ctx) {
  const bookId = ctx.params.id; // Get the book ID from URL parameter
  const result = await reviews.getAll(bookId); // Fetch all reviews for the book from the model
  if (result.length === 0) {
    ctx.status = 404;
    ctx.body = { error: 'No reviews found for this book' };
  } else {
    ctx.body = result; // Return the list of reviews for the book
  }
}

//get review by ID
async function getReviewById(ctx) {
  const id = ctx.params.id;
  const result = await reviews.getById(id);

  if (result.length === 0) {
    ctx.status = 404;
    ctx.body = { error: 'Review not found' };
  } else {
    const review = result[0];
    ctx.body = {
      ...review,
      links: {
        self: `${ctx.protocol}://${ctx.host}${router.prefix}/${review.ID}`, // Link to this specific review
        user: `${ctx.protocol}://${ctx.host}/api/v1/users/${review.userID}`,
        book: `${ctx.protocol}://${ctx.host}/api/v1/books/${review.bookID}`, // Link to the associated book
      },
    };
  }
}


//create new review
async function createReview(ctx) {
  const { bookID, userID, content, rating } = ctx.request.body;
  const result = await reviews.add({ bookID, userID, content, rating });
  ctx.status = 201;
  ctx.body = {
    message: 'Review created',
    id: result.insertId,
    links: {
      self: `${ctx.protocol}://${ctx.host}${router.prefix}/${result.insertId}`, // Link to this specific review
      user: `${ctx.protocol}://${ctx.host}/api/v1/users/${userID}`,
      book: `${ctx.protocol}://${ctx.host}/api/v1/books/${bookID}`, // Link to the associated book
    },
  };
}

async function updateReview(ctx) {
  const bookId = ctx.params.id; // Get the book ID from URL parameter
  const reviewId = ctx.params.reviewId; // Get the review ID from URL parameter
  
  console.log('Update review params:', { bookId, reviewId });
  console.log('Update review body:', ctx.request.body);
  
  // Get the review first to check permissions and ensure it exists
  const reviewResult = await reviews.getById(reviewId);
  if (reviewResult.length === 0) {
    ctx.status = 404;
    ctx.body = { error: 'Review not found' };
    return;
  }
  
  // Use only the fields that are allowed to be updated
  const { content, rating } = ctx.request.body;
  console.log('Updating review with:', { content, rating });
  
  try {
    const result = await reviews.update(reviewId, { content, rating });
    console.log('Update result:', result);
    
    if (result.affectedRows) {
      ctx.body = { message: 'Review updated', result };
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Review not found' };
    }
  } catch (error) {
    console.error('Error updating review:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to update review', message: error.message };
  }
}


//update existing review
/*async function updateReview(ctx) {
  const bookId = ctx.params.id; // Get the book ID from URL parameter
  const reviewId = ctx.params.reviewId; // Get the review ID from URL parameter
  const { content, rating } = ctx.request.body; // Get the updated data for the review
  const result = await reviews.update(reviewId, { content, rating }); // Update the review in the database
  if (result.affectedRows) {
    ctx.body = { message: 'Review updated', result };
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Review not found' };
  }
}*/

//delete review by ID
async function deleteReview(ctx) {
  const reviewId = ctx.params.reviewId; // Get the review ID from URL parameter
  const result = await reviews.deleteById(reviewId); // Delete the review from the database
  if (result.affectedRows) {
    ctx.body = { message: 'Review deleted', id: reviewId };
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Review not found' };
  }
}

//get the average rating for a book
async function getAverageRating(ctx) {
  const bookId = ctx.params.id; // Get the book ID from URL parameter
  const avgRating = await reviews.getAverageRating(bookId); // Get average rating from the model
  if (avgRating === null) {
    ctx.status = 404;
    ctx.body = { error: 'No reviews found for this book to calculate average rating' };
  } else {
    ctx.body = { averageRating: avgRating }; // Return average rating for the book
  }
}

module.exports = router;
