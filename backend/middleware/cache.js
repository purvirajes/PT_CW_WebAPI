// middleware/cache.js
module.exports = async (ctx, next) => {
    ctx.set('Cache-Control', 'public, max-age=3600'); //cache for 1 hour
    await next();
  };
  