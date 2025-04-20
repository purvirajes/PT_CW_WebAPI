// permissions/users.js
const Router = require('koa-router');
const users = require('../models/users');
const { read, update, delete: deleteUser } = require('../permissions/users'); 

const router = new Router({ prefix: '/api/v1/users' });

//updates user profile
router.put('/:id', async (ctx) => {
  const currentUser = ctx.state.user; 
  const targetUser = await users.getById(ctx.params.id); 

  const permission = update(currentUser, targetUser); //checks if currentUser has permission to update targetUser

  if (!permission.granted) {
    ctx.status = 403; // Forbidden
    ctx.body = { error: 'You do not have permission to update this user.' };
    return;
  }

  //proceeds with update logic if permitted
  await users.update(ctx.request.body);
  ctx.body = { message: 'User updated successfully' };
});

//delete user
router.del('/:id', async (ctx) => {
  const currentUser = ctx.state.user; //current logged-in user
  const targetUser = await users.getById(ctx.params.id); // User to delete

  const permission = deleteUser(currentUser, targetUser); // Check if currentUser has permission to delete targetUser

  if (!permission.granted) {
    ctx.status = 403; //forbidden
    ctx.body = { error: 'You do not have permission to delete this user.' };
    return;
  }

  //proceeds with delete logic if permitted
  await users.delById(ctx.params.id);
  ctx.body = { message: 'User deleted successfully' };
});

module.exports = router;

  