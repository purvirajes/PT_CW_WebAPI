//controllers/validation.js
const Ajv = require('ajv');
const ajvFormats = require('ajv-formats');
const ajv = new Ajv({allErrors: true});

ajvFormats(ajv);

//load the schemas
const userSchema = require('../schemas/user.json').definitions.user;
const bookSchema = require('../schemas/book.json').definitions.book;
const genreSchema = require('../schemas/genre.json').definitions.genre;
const reviewSchema = require('../schemas/review.json').definitions.review;

//wrap the makeValidator function to add logging
function makeValidator(schema, resourceName) {
  const validate = ajv.compile(schema);
  return async (ctx, next) => {
    console.log(`Validating ${resourceName}:`, ctx.request.body);
    const valid = validate(ctx.request.body);
    if (!valid) {
      console.error(`Validation failed for ${resourceName}:`, validate.errors);
      ctx.status = 400;
      ctx.body = {
        error: `Validation failed for ${resourceName}`,
        details: validate.errors,
      };
    } else {
      console.log(`Validation passed for ${resourceName}`);
      await next();
    }
  };
}

//updated validateReview to add logging
function validateReview(ctx, next) {
  console.log('Review validation called with:', ctx.request.body);
  const { rating, content } = ctx.request.body;
  
  // Checks if rating is between 1 and 5
  if (rating < 1 || rating > 5) {
    console.error('Rating validation failed:', rating);
    ctx.status = 400;
    ctx.body = { error: 'Rating must be between 1 and 5' };
  }
  // Checks review text 
  else if (!content || content.trim().length === 0) {
    console.error('Content validation failed:', content);
    ctx.status = 400;
    ctx.body = { error: 'Review content cannot be empty' };
  } else {
    console.log('Review validation passed');
    next();
  }
}

module.exports = {
  validateUser: makeValidator(userSchema, 'user'),
  validateBook: makeValidator(bookSchema, 'book'),
  validateGenre: makeValidator(genreSchema, 'genre'),
  validateReview: makeValidator(reviewSchema, 'review') //validation for review
};

