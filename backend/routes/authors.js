//routes/authors.js
const Router = require('koa-router');
const authors = require('../models/authors');  // authors model
const bodyParser = require('koa-bodyparser');
const auth = require('../middleware/auth');

const router = new Router({ prefix: '/api/v1/authors' });

//GET all authors
router.get('/', async (ctx) => {
  ctx.body = await authors.getAllAuthors();
});

//GET author by ID
router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  const result = await authors.getAuthorById(id);
  ctx.body = result.length ? result[0] : { error: 'Author not found' };
});

//POST create new author
router.post('/', bodyParser(), async (ctx) => {
  const { name, bio } = ctx.request.body;
  const result = await authors.createAuthor({ name, bio });
  ctx.status = 201;
  // Must match expected test format: { created: true }
  ctx.body = { created: true, id: result.insertId };
});

//PUT update an author
router.put('/:id', bodyParser(), async (ctx) => {
  const id = ctx.params.id;
  const { name, bio } = ctx.request.body;
  const result = await authors.updateAuthor(id, { name, bio });
  // Must match expected test format: { updated: true }
  ctx.body = { updated: true, result };
});

//DELETE remove an author
router.delete('/:id', async (ctx) => {
  const id = ctx.params.id;
  await authors.deleteAuthor(id);
  // Must match expected test format: { deleted: true }, status code 200
  ctx.status = 200;
  ctx.body = { deleted: true };
});

module.exports = router;




//routes/authors.js
/*const Router = require('koa-router');
const authors = require('../models/authors');  // authors model

const router = new Router({ prefix: '/api/v1/authors' });

//GET all authors
router.get('/', async (ctx) => {
  ctx.body = await authors.getAllAuthors();
});

//GET author by ID
router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  const result = await authors.getAuthorById(id);
  ctx.body = result.length ? result[0] : { error: 'Author not found' };
});

//POST create new author
router.post('/', async (ctx) => {
  const { name, bio } = ctx.request.body;
  const result = await authors.createAuthor({ name, bio });
  ctx.status = 201;
  ctx.body = { message: 'Author created', id: result.insertId };
});

//PUT update an author
router.put('/:id', async (ctx) => {
  const id = ctx.params.id;
  const { name, bio } = ctx.request.body;
  const result = await authors.updateAuthor(id, { name, bio });
  ctx.body = { message: 'Author updated', result };
});

//DELETE remove an author
router.delete('/:id', async (ctx) => {
  const id = ctx.params.id;
  await authors.deleteAuthor(id);
  ctx.status = 204;
});

module.exports = router;*/
