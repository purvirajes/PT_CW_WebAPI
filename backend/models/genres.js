// models/genres.js
const db = require('../helpers/database');

// Get all genres
exports.getAll = async function() {
  const query = 'SELECT * FROM genres';
  return await db.run_query(query);
};

// Add a new genre
exports.add = async function(genre) {
  const query = 'INSERT INTO genres SET ?';
  return await db.run_query(query, genre);
};

// Get a genre by ID
exports.getById = async function(id) {
  const query = 'SELECT * FROM genres WHERE ID = ?';
  return await db.run_query(query, [id]);
};

// Update a genre
exports.update = async function(genre) {
  const query = 'UPDATE genres SET ? WHERE ID = ?';
  return await db.run_query(query, [genre, genre.ID]);
};

// Delete a genre
exports.delById = async function(id) {
  const query = 'DELETE FROM genres WHERE ID = ?';
  return await db.run_query(query, [id]);
};
