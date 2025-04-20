//routes/users.js
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const users = require('../models/users');
const auth = require('../middleware/auth');
const { validateUser } = require('../controllers/validation');
const jwt = require('jsonwebtoken');

const router = new Router({ prefix: '/api/v1/users' });

router.get('/', auth, getAllUsers);
router.post('/', validateUser, createUser);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, bodyParser(), validateUser, updateUser);
router.del('/:id', auth, deleteUser);
router.post('/login', bodyParser(), login);

//enabling test-login route only when in test environement
if (process.env.NODE_ENV === 'test') {
  router.post('/test-login', async (ctx) => {
    // Create a test admin user token directly
    const payload = { 
      ID: 1, 
      username: 'admin', 
      role: 'admin'
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-testing-secret-key');
    ctx.body = { token };
  });
}

//handlers
async function getAllUsers(ctx) {
  try {
    ctx.body = await users.getAll();
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to retrieve users', message: error.message };
  }
}

async function getUserById(ctx) {
  try {
    const id = ctx.params.id;
    const result = await users.getById(id);

    if (result.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
    } else {
      const user = result[0];
      ctx.body = {
        ...user,
        links: {
          self: `${ctx.protocol}://${ctx.host}${router.prefix}/${user.ID}`,
          books: `${ctx.protocol}://${ctx.host}/api/v1/books?authorID=${user.ID}`,
        },
      };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to retrieve user', message: error.message };
  }
}

async function createUser(ctx) {
  try {
    const result = await users.add(ctx.request.body);
    ctx.status = 201;
    ctx.body = {
      message: 'User created',
      id: result.insertId,
      links: {
        self: `${ctx.protocol}://${ctx.host}${router.prefix}/${result.insertId}`,
        login: `${ctx.protocol}://${ctx.host}/api/v1/users/login`,
      },
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {error: err.message};
  }
}

async function updateUser(ctx) {
  try {
    const id = ctx.params.id;
    const updateData = { ...ctx.request.body, ID: id };
    const result = await users.update(updateData);
    
    ctx.body = { updated: true };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to update user', message: error.message };
  }
}

async function deleteUser(ctx) {
  try {
    const id = ctx.params.id;
    await users.delById(id);
    ctx.body = { deleted: true };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to delete user', message: error.message };
  }
}

//login handler
async function login(ctx) {
  const { username, password } = ctx.request.body;
  
  try {
    const user = await users.authenticate(username, password);
    if (user) {
      //generates JWT token
      const payload = { ID: user.ID, username: user.username, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-testing-secret-key');
      ctx.body = { token };
    } else {
      ctx.status = 401;
      ctx.body = { error: 'Invalid username or password' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
}

module.exports = router;
// Debug login route specifically for tests
/*router.post('/test-login', async (ctx) => {
  console.log('Test login route called');
  
  // Create a test admin user token directly
  const payload = { 
    ID: 1, 
    username: 'admin', 
    role: 'admin'  // This is critical - must be 'admin'
  };
  
  console.log('Creating test token with payload:', payload);
  
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  console.log('Test token created successfully');
  
  ctx.body = { token };
});

//handlers
async function getAllUsers(ctx) {
  ctx.body = await users.getAll();
}

async function getUserById(ctx) {
  const id = ctx.params.id;
  const result = await users.getById(id);

  if (result.length === 0) {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
  } else {
    const user = result[0];
    ctx.body = {
      ...user,
      links: {
        self: `${ctx.protocol}://${ctx.host}${router.prefix}/${user.ID}`, // Link to this specific user
        books: `${ctx.protocol}://${ctx.host}/api/v1/books?authorID=${user.ID}`, // Link to books by this user (if applicable)
      },
    };
  }
}


async function createUser(ctx) {
  try{
  const result = await users.add(ctx.request.body);
  ctx.status = 201;
  ctx.body = {
    message: 'User created',
    id: result.insertId,
    links: {
      self: `${ctx.protocol}://${ctx.host}${router.prefix}/${result.insertId}`, // Link to the created user
      login: `${ctx.protocol}://${ctx.host}/api/v1/users/login`, // Link to login for the user
    },
  };
} catch (err) {
  ctx.status = 400;
  ctx.body = {error: err.message};
  }
}

async function updateUser(ctx) {
  try {
    const id = ctx.params.id;
    console.log('Updating user with ID:', id);
    console.log('Update user request body:', ctx.request.body);
    
    // Ensure we're passing the ID correctly
    const updateData = { ...ctx.request.body, ID: id };
    console.log('Final update data:', updateData);
    
    const result = await users.update(updateData);
    console.log('Update result:', result);
    
    ctx.body = { updated: true };
  } catch (error) {
    console.error('Error updating user:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to update user', message: error.message };
  }
}
/*async function updateUser(ctx) {
  const id = ctx.params.id;
  const result = await users.update({ ...ctx.request.body, ID: id });
  ctx.body = { updated: true };
}*/

/*async function deleteUser(ctx) {
  const id = ctx.params.id;
  await users.delById(id);
  ctx.body = { deleted: true };
}

//login handler
async function login(ctx) {
  const { username, password } = ctx.request.body;
  
  try {
    const user = await users.authenticate(username, password);
    if (user) {
      // Generate JWT token
      const payload = { ID: user.ID, username: user.username, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      ctx.body = { token };
    } else {
      ctx.status = 401;
      ctx.body = { error: 'Invalid username or password' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
}

module.exports = router;*/


