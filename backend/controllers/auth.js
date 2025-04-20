//controllers/auth.js
const passport = require('koa-passport');
const {Strategy, ExtractJwt} = require('passport-jwt');
const userModel = require('../models/users');
const jwt = require('jsonwebtoken');

//JWT Authentication strategy
passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-testing-secret-key',  // Use JWT_SECRET from .env file
}, async (jwt_payload, done) => {
  try {
    // Find the user by ID in the JWT payload
    const user = await userModel.getById(jwt_payload.id);  // Assuming userModel has findById method
    if (!user) {
      return done(null, false); // User not found
    }
    return done(null, user);  // User found, authentication successful
  } catch (err) {
    done(err, false); // In case of any errors
  }
}));

module.exports = async(ctx, next) => {
  return passport.authenticate('jwt', {session: false}, async (err, user) => {
    if (user === false) {
      ctx.status = 401;
      ctx.body = {error: 'Access denied. Invalid credentials!'};
    } else {
      const payload = {ID: user.ID, username: user.username, role: user.role};
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-testing-secret-key');
      ctx.body = {token};
      await next();
    }
  })(ctx, next)
};