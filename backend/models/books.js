// models/books.js
const db = require('../helpers/database');

// Get all books with pagination
exports.getAll = async function(page, limit) {
  const offset = (page - 1) * limit;
  const query = 'SELECT * FROM books LIMIT ? OFFSET ?';
  return await db.run_query(query, [parseInt(limit), parseInt(offset)]);
};

// Add a new book (with imageURL)
exports.add = async function(book) {
  const query = 'INSERT INTO books SET ?';
  return await db.run_query(query, book);
};

// Get book by ID
exports.getById = async function(id) {
  const query = 'SELECT * FROM books WHERE ID = ?';
  return await db.run_query(query, [id]);
};

// Update a book
exports.update = async function(book) {
  const query = 'UPDATE books SET ? WHERE ID = ?';
  return await db.run_query(query, [book, book.ID]);
};

// Delete a book by ID
exports.delById = async function(id) {
  const query = 'DELETE FROM books WHERE ID = ?';
  return await db.run_query(query, [id]);
};
