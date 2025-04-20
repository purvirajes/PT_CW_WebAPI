// routes/genres.js
const Router = require('koa-router');
const genres = require('../models/genres');
const { validateGenre } = require('../controllers/validation');

const router = new Router({ prefix: '/api/v1/genres' });
const bodyParser = require('koa-bodyparser');

router.get('/', getAllGenres);
router.post('/', bodyParser(), validateGenre, createGenre);
router.get('/:id', getGenreById);
router.put('/:id', bodyParser(), validateGenre, updateGenre);
router.del('/:id', deleteGenre);

// Handlers
async function getAllGenres(ctx) {
  const result = await genres.getAll();
  ctx.body = result.map(genre => ({
    ...genre,
    links: {
      self: `${ctx.protocol}://${ctx.host}${router.prefix}/${genre.ID}`, // Link to this genre
      books: `${ctx.protocol}://${ctx.host}/api/v1/books?genreID=${genre.ID}`, // Link to books in this genre
    },
  }));
}

async function getGenreById(ctx) {
  const id = ctx.params.id;
  const result = await genres.getById(id);

  if (result.length === 0) {
    ctx.status = 404;
    ctx.body = { error: 'Genre not found' };
  } else {
    const genre = result[0];
    ctx.body = {
      ...genre,
      links: {
        self: `${ctx.protocol}://${ctx.host}${router.prefix}/${genre.ID}`, // Link to this genre
        books: `${ctx.protocol}://${ctx.host}/api/v1/books?genreID=${genre.ID}`, // Link to books in this genre
      },
    };
  }
}

async function createGenre(ctx) {
  const result = await genres.add(ctx.request.body);
  ctx.status = 201;
  ctx.body = { created: true, ID: result.insertId };
}

async function updateGenre(ctx) {
  const id = ctx.params.id;
  const result = await genres.update({ ...ctx.request.body, ID: id });
  ctx.body = { updated: true };
}

async function deleteGenre(ctx) {
  const id = ctx.params.id;
  await genres.delById(id);
  ctx.body = { deleted: true };
}

module.exports = router;
