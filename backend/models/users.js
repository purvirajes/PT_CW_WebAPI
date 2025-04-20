// models/users.js
const db = require('../helpers/database');
const bcrypt = require('bcryptjs');

//validating password length function
function validatePassword(password) {
  const minLength = 8;
  if (password.length < minLength) {
    throw new Error (`Password must be at least ${minLength} characters long.`);
  }
}

// Hash user password before storing
async function hashPassword(password) {
  validatePassword(password);
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Create a new user with hashed password
exports.add = async function add(user) {
  user.password = await hashPassword(user.password);//hashes password with validation
  const query = 'INSERT INTO users SET ?';
  return await db.run_query(query, user);
};

// Get all users (admin only)
exports.getAll = async function getAll() {
  const query = 'SELECT ID, username, email, role FROM users';
  return await db.run_query(query);
};

// Get a single user by ID
exports.getById = async function getById(id) {
  const query = 'SELECT ID, username, email, role FROM users WHERE ID = ?';
  return await db.run_query(query, [id]);
};

// Update user data (profile)
exports.update = async function update(user) {
  if (user.password){
    user.password = await hashPassword(user.password);
  }
  const query = 'UPDATE users SET ? WHERE ID = ?';
  return await db.run_query(query, [user, user.ID]);
};

// Delete a user by ID
exports.delById = async function delById(id) {
  const query = 'DELETE FROM users WHERE ID = ?';
  return await db.run_query(query, [id]);
};

// Authenticate a user
exports.authenticate = async function authenticate(username, password) {
  const query = 'SELECT * FROM users WHERE username = ?';
  const users = await db.run_query(query, [username]);
  
  if (users.length === 0) {
    return null;
  }
  
  const user = users[0];
  const match = await bcrypt.compare(password, user.password);
  
  return match ? user : null;
};