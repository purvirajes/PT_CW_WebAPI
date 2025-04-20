//routes/special.js - RBAC
const Router = require('koa-router');
const auth = require('../controllers/auth');

const router = new Router({ prefix: '/api/v1/special' });

//protected route: only accessible to logged-in users
router.get('/user', auth, (ctx) => {
  ctx.body = {
    message: `Hello ${ctx.state.user.username}, you are logged in as a ${ctx.state.user.role}.`
  };
});

//admin-only route: shows role-based control
router.get('/admin', auth, (ctx) => {
  if (ctx.state.user.role === 'admin') {
    ctx.body = {
      message: 'Access granted. Welcome, admin!',
      user: ctx.state.user
    };
  } else {
    ctx.status = 403;
    ctx.body = {
      error: 'Access denied. Admins only.'
    };
  }
});

module.exports = router;
