// models/reviews.js
const db = require('../helpers/database');

// Get all reviews for a book
exports.getAll = async function(bookId) {
  const query = 'SELECT * FROM reviews WHERE bookID = ?';
  return await db.run_query(query, [bookId]);
};

// Add a new review (with rating)
exports.add = async function(review) {
  const { bookID, userID, content, rating } = review; // Include rating (1-5)
  // Validation: Make sure the rating is between 1 and 5
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  const query = 'INSERT INTO reviews (bookID, userID, content, rating) VALUES (?, ?, ?, ?)';
  return await db.run_query(query, [bookID, userID, content, rating]);
};

// Get a review by ID
exports.getById = async function(id) {
  const query = 'SELECT * FROM reviews WHERE ID = ?';
  return await db.run_query(query, [id]);
};

// Delete a review by ID
exports.deleteById = async function(id) {
  const query = 'DELETE FROM reviews WHERE ID = ?';
  return await db.run_query(query, [id]);
};

// Get the average rating for a book
exports.getAverageRating = async function(bookId) {
  const query = 'SELECT AVG(rating) AS averageRating FROM reviews WHERE bookID = ?';
  const result = await db.run_query(query, [bookId]);
  return result[0].averageRating; // Returns the average rating for the book
};

// Update a review
exports.update = async function(reviewId, updateData) {
  const query = 'UPDATE reviews SET ? WHERE ID = ?';
  return await db.run_query(query, [updateData, reviewId]);
};
