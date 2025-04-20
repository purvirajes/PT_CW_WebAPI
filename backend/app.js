// app.js
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const { koaSwagger } = require('koa2-swagger-ui');
const YAML = require('yamljs');
const serve = require('koa-static');
const path = require('path');
const passport = require('koa-passport');
const dotenv = require('dotenv');
const mount = require('koa-mount');
dotenv.config();

//importing the routes
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');
const genreRoutes = require('./routes/genres');
const authorRoutes = require('./routes/authors');
const specialRoutes = require('./routes/special');

const app = new Koa();
const router = new Router();

//middleware
app.use(cors());
app.use(bodyParser());
app.use(serve(path.join(__dirname, 'public')));

//starting passport
require('./controllers/auth');
app.use(passport.initialize());

const swaggerDocument = YAML.load('./openapi.yaml'); //swagger document 

//setting-up swagger
app.use(
  koaSwagger({
    routePrefix: '/api-docs',
    swaggerOptions: {
      spec: swaggerDocument,
    },
  })
);

// Serve Swagger Editor if the package is installed
try {
  app.use(mount('/swagger-editor', serve(path.join(__dirname, 'node_modules/swagger-editor-dist'))));
  
  router.get('/api-editor', async (ctx) => {
    ctx.body = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Swagger Editor</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            height: 100vh;
          }
          #swagger-editor {
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="swagger-editor"></div>
        <script src="/swagger-editor/swagger-editor-bundle.js"></script>
        <script src="/swagger-editor/swagger-editor-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            window.editor = SwaggerEditorBundle({
              dom_id: '#swagger-editor',
              url: '/openapi.yaml',
              presets: [SwaggerEditorStandalonePreset]
            });
          }
        </script>
      </body>
      </html>
    `;
  });
  
  console.log('Swagger Editor available at /api-editor');
} catch (error) {
  console.warn('Swagger Editor not available:', error.message);
}

//API routes
app.use(userRoutes.routes());
app.use(bookRoutes.routes());
app.use(reviewRoutes.routes());
app.use(genreRoutes.routes());
app.use(authorRoutes.routes());
app.use(specialRoutes.routes());

//API welcome message
router.get('/api/v1', (ctx) => {
  ctx.body = {
    message: 'Welcome to the Book & Literature API!',
    resources: [
      '/api/v1/books',
      '/api/v1/authors',
      '/api/v1/genres',
      '/api/v1/reviews',
      '/api/v1/users'
    ]
  };
});

app.use(router.routes());

module.exports = app;