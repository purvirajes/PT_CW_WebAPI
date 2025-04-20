//index.js
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')
const cors = require ('@koa/cors');
const { koaSwagger } = require ('koa2-swagger-ui');
const YAML = require ('yamljs')
const serve = require ('koa-static');
const path = require ('path');
const passport = require('koa-passport');
const dotenv = require ('dotenv');
const mount = require ('koa-mount');

dotenv.config();

//importing routes
const userRoutes = require('./routes/users');            
const bookRoutes = require('./routes/books');            
const reviewRoutes = require('./routes/reviews');        
const genreRoutes = require('./routes/genres');          
const authorRoutes = require('./routes/authors');        
const specialRoutes = require('./routes/special'); 

const app = new Koa();
const router = new Router();

//middleware
app.use(cors({
  origin: ['https://collectlucas-printerultra-3001.codio-box.uk', 'http://localhost:3001'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser()); 
app.use(serve(path.join(__dirname, 'public')));
require('./controllers/auth');
app.use(passport.initialize()); //starts passport for JWT authentication

const swaggerDocument = YAML.load('./openapi.yaml');

app.use(
  koaSwagger({
    routePrefix: '/api-docs',
    swaggerOptions: {
      spec: swaggerDocument,
    },
  })
);


app.use(mount('/swagger-editor', serve(path.join(__dirname, 'node_modules/swagger-editor-dist'))));
app.use(serve(path.join(__dirname)));

router.get('/api-editor', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Swagger Editor</title>
      <style>
        body { margin: 0; padding: 0; height: 100vh; }
        #swagger-editor { height: 100%; }
      </style>
    </head>
    <body>
      <div id="swagger-editor"></div>
      <script src="/swagger-editor/swagger-editor-bundle.js"></script>
      <script src="/swagger-editor/swagger-editor-standalone-preset.js"></script>
      <script>
        window.onload = function() {
          const editor = SwaggerEditorBundle({
            dom_id: '#swagger-editor',
            url: '/openapi.yaml',
            presets: [
              SwaggerEditorStandalonePreset
            ]
          });
        }
      </script>
    </body>
    </html>
  `;
});

//registering routes/API routes
app.use(router.routes()).use(router.allowedMethods());
app.use(userRoutes.routes());
app.use(bookRoutes.routes());
app.use(reviewRoutes.routes());
app.use(genreRoutes.routes());
app.use(authorRoutes.routes());
app.use(specialRoutes.routes());


//base route
router.get('/api/v1', (ctx) => {
  ctx.body = {
    message: 'Welcome to the Book & Literature Review API!',
    resources: [
      '/api/v1/books',
      '/api/v1/authors',
      '/api/v1/genres',
      '/api/v1/reviews',
      '/api/v1/users'
    ],
    documentation: {
      swaggerUI: '/api-docs',
      swaggerEditor: '/api-editor',
      openAPISpec: '/openapi.yaml'
    }
  };
});

app.use(router.routes());


// Start server using dynamic config for domain and port
const port = process.env.PORT || 3000;
app.listen (port, () => {
  console.log (`Server running on ${port}`);
  console.log('Book API running at https://collectlucas-printerultra-3000.codio-box.uk/api/v1');
  console.log('API Editor running at https://collectlucas-printerultra-3000.codio-box.uk/api/v1/api-editor');
  console.log('API Documentation running at https://collectlucas-printerultra-3000.codio-box.uk/api/v1/api-docs');
});
