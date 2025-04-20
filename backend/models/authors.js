// models/authors.js
const db = require('../helpers/database');

// Fetch all authors
exports.getAllAuthors = async function() {
  const query = 'SELECT * FROM authors';
  return await db.run_query(query);
};

// Fetch an author by ID
exports.getAuthorById = async function(id) {
  const query = 'SELECT * FROM authors WHERE id = ?';
  return await db.run_query(query, [id]);
};

// Create a new author
exports.createAuthor = async function({ name, bio }) {
  const query = 'INSERT INTO authors (name, bio) VALUES (?, ?)';
  return await db.run_query(query, [name, bio]);
};

// Update an existing author
exports.updateAuthor = async function(id, { name, bio }) {
  const query = 'UPDATE authors SET name = ?, bio = ? WHERE id = ?';
  return await db.run_query(query, [name, bio, id]);
};

// Delete an author
exports.deleteAuthor = async function(id) {
  const query = 'DELETE FROM authors WHERE id = ?';
  return await db.run_query(query, [id]);
};
