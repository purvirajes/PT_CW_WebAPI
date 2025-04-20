// routes/books.js
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const books = require('../models/books');
const auth = require('../middleware/auth');
const can = require('../permissions/books'); // Import permissions for books
const { validateBook } = require('../controllers/validation');

const router = new Router({ prefix: '/api/v1/books' });

router.get('/', getAllBooks);
router.post('/', auth, bodyParser(), validateBook, createBook);
router.get('/:id', getBookById);
router.put('/:id', auth, bodyParser(), validateBook, updateBook);
router.del('/:id', auth, deleteBook);

// Handlers

// Get all books
async function getAllBooks(ctx) {
  const { page = 1, limit = 100 } = ctx.request.query;
  const result = await books.getAll(page, limit);

  ctx.body = result.map(book => {
    const { ID, title, summary, authorID, imageURL } = book;
    return {
      ID,
      title,
      summary,
      authorID,
      imageURL, // Added imageURL
      links: {
        self: `${ctx.protocol}://${ctx.host}${router.prefix}/${book.ID}`, // Link to this specific book
        reviews: `${ctx.protocol}://${ctx.host}${router.prefix}/${book.ID}/reviews`, // Link to reviews for this book
      }
    };
  });
}

// Get a specific book by ID
async function getBookById(ctx) {
  const id = ctx.params.id;
  const result = await books.getById(id);
  if (result.length === 0) {
    ctx.status = 404;
    ctx.body = { error: 'Book not found' };
  } else {
    const book = result[0];
    ctx.body = {
      ...book,
      links: {
        self: `${ctx.protocol}://${ctx.host}${router.prefix}/${book.ID}`, // Link to this specific book
        reviews: `${ctx.protocol}://${ctx.host}${router.prefix}/${book.ID}/reviews`, // Link to reviews for this book
        author: `${ctx.protocol}://${ctx.host}/api/v1/authors/${book.authorID}`,
      }
    };
  }
}

// Create a new book (Only allowed for authorized users)
async function createBook(ctx) {
  const permission = can.create(ctx.state.user);  // Check if user has permission to create a book
  if (!permission.granted) {
    ctx.status = 403;
    ctx.body = { error: 'Forbidden: You do not have permission to create a book' };
    return;
  }

  const result = await books.add(ctx.request.body);
  ctx.status = 201;
  ctx.body = { created: true, ID: result.insertId };
}

// Update an existing book (Only allowed for authorized users)
async function updateBook(ctx) {
  const id = ctx.params.id;
  const result = await books.getById(id);
  const permission = can.update(ctx.state.user, result[0]);  // Check if user has permission to update the book

  if (!permission.granted) {
    ctx.status = 403;
    ctx.body = { error: 'Forbidden: You do not have permission to update this book' };
    return;
  }

  const updateResult = await books.update({ ...ctx.request.body, ID: id });
  ctx.body = { updated: true };
}

// Delete a book (Only allowed for authorized users)
async function deleteBook(ctx) {
  const id = ctx.params.id;
  const permission = can.delete(ctx.state.user);  // Check if user has permission to delete the book

  if (!permission.granted) {
    ctx.status = 403;
    ctx.body = { error: 'Forbidden: You do not have permission to delete this book' };
    return;
  }

  await books.delById(id);
  ctx.body = { deleted: true };
}

module.exports = router;
