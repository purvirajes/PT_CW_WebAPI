// middleware/auth.js
//const passport = require('koa-passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async function(ctx, next) {
  // Get the token from the Authorization header
  const token = ctx.headers['authorization']?.split(' ')[1]; //assumes token is passed as 'Bearer <token>' in header

  if (!token) {
    console.log('No token provided');
    ctx.status = 401;
    ctx.body = { error: 'Authentication token is required' };
    return;
  }

  try {
    //verifying JWT token
    const secret = process.env.JWT_SECRET || 'your-testing-secret-key';
    const decoded = jwt.verify(token, secret);
    ctx.state.user = decoded;
    await next ();
  } catch (err){
    ctx.status = 403;
    ctx.body = { error: 'Invalid or expired token'};
  }
};
/*module.exports = async function(ctx, next) {
  // Get the token from the Authorization header
  const token = ctx.headers['authorization']?.split(' ')[1]; //assumes token is passed as 'Bearer <token>' in header

  console.log('Auth middleware called');
  console.log('Headers:', ctx.headers);
  console.log('Token:', token ? token.substring(0, 10) + '...' : 'none'); // Only log part of the token for security

  if (!token) {
    console.log('No token provided');
    ctx.status = 401;
    ctx.body = { error: 'Authentication token is required' };
    return;
  }

  try {
    // Verifying JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully');
    console.log('Decoded token payload:', {
      ID: decoded.ID,
      username: decoded.username,
      role: decoded.role,
    });
    
    // Let's make sure we have what we need
    if (!decoded.role) {
      console.log('WARNING: decoded token has no role property');
    }
    
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    console.error('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'undefined');
    ctx.status = 403;
    ctx.body = { error: 'Invalid or expired token' };
  }
};*/
/*module.exports = async function(ctx, next) {
  try {
    // BYPASS AUTHENTICATION FOR TESTING
    console.log('Auth middleware bypassed for testing');
    ctx.state.user = { ID: 1, username: 'admin', role: 'admin' };
    
    
    try {
      await next();
      console.log('Next middleware executed successfully');
    } catch (nextError) {
      console.error('Error in subsequent middleware or route handler:', nextError);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error in handler', message: nextError.message };
    }
  } catch (error) {
    console.error('Error in auth middleware:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error in auth', message: error.message };
  }
};*/

/*module.exports = async function(ctx, next) {
  // Get the token from the Authorization header
  const token = ctx.headers['authorization']?.split(' ')[1]; //assumes token is passed as 'Bearer <token>' in header

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Authentication token is required' };
    return;
  }

  try {
    console.log('Token being verified:', token);
    console.log('JWT_SECRET first few chars:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0,3) + '...' : 'undefined');
    // Verifying JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    ctx.state.user = decoded; 
    await next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    ctx.status = 403;
    ctx.body = { error: 'Invalid or expired token' };
  }
};*/
