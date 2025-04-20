# PT_CW_WebAPI
This repository contains the frontend and backend code for an online book and literature website called book review app. 
It is a full-stack web application built using Koa Node JS framework to build the backend. MySQL for database and ReactJS single page application (SPA) web client for the frontend.

admin user: username = admin, password = admin123

regular user: username = testuser123, password = password123 (or register for a new account)

## Setup
run 'npm install' to get all dependencies
backend setup
cd PT_CW_WebAPI/backend press enter then npm start (press on the link api documentation and book api link to see the what it looks like)
the below is displayed:

Server running on 3000

Book API running at https://collectlucas-printerultra-3000.codio-box.uk/api/v1

API Editor running at https://collectlucas-printerultra-3000.codio-box.uk/api/v1/api-editor

API Documentation running at https://collectlucas-printerultra-3000.codio-box.uk/api/v1/api-docs


cd PT_CW_WebAPI/frontend press enter then npm start and click BoxUrl on codio for it to open make sure to change from 3000 to 3001


##Tech Stack
### Backend:
- [Koa.js] – Lightweight web framework for Node.js
- [koa-router] – Routing middleware
- [koa-bodyparser] – Parses incoming request bodies
- [koa-cors] – Cross-Origin Resource Sharing support
- [koa-passport] – Authentication support
- [jsonwebtoken] – JWT for secure authentication
- [promise-mysql] – MySQL client
- [bcryptjs] – Password hashing
- [dotenv] – Manage environment variables
- [Jest] – Testing framework (automated)
  
### Frontend
- [React] – SPA framework
- [React Router] – Routing for single-page applications + Bootstrap
- [Axios] – HTTP client for API requests

## .env file in backend/
```env
DB_HOST=localhost
DB_USER=root 
DB_PASSWORD=codio
DB_NAME=bookstore

JWT_SECRET=mySuperSecureSecret123
PORT=3000
```

## Runing Jest Tests
cd PT_CW_WebAPI/backend press enter and write npm test and press enter

There are also tests done through Postman

##API Documentation
- /api-docs
- /api-editor
- openapi.yaml (also found in the feasibility report)

## Project Structure
```
PT_CW_WebAPI/
│
├── backend/                    # Koa.js API backend
│   ├── controllers/            # Request handling logic
│   ├── helpers/                # Utility/helper functions
│   ├── middleware/             # Auth and middleware functions
│   ├── models/                 # Database model definitions
│   ├── permissions/            # Role-based access logic
│   ├── routes/                 # API route definitions
│   ├── schemas/                # Data validation schemas
│   ├── sql_scripts/            # SQL setup and seed files
│   ├── tests/                  # Jest test files
│   ├── .env                    # Environment variables
│   ├── app.js                  # Main Koa app configuration
│   ├── index.js                # Server entry point
│   ├── openapi.yaml            # API specification file
│   ├── package.json            # Backend dependencies and scripts
│
├── frontend/                   # React SPA frontend
│   ├── public/                 # Static files and HTML template
│   ├── src/                    # Source files
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React context/state management
│   │   ├── pages/              # Page-level components
│   │   ├── utilities/          # Utility functions
│   │   ├── App.js              # Main App component
│   │   ├── App.css             # Global styles
│   │   ├── App.test.js         # React test file
│   │   ├── index.js            # React entry point
│   │   ├── index.css           # Entry point styles
│   │   ├── logo.svg            # Logo asset
│   │   ├── reportWebVitals.js  # Performance measuring
│   │   └── setupTests.js       # Jest setup
│   ├── .env                    # Environment variables
│   ├── package.json            # Frontend dependencies and scripts
│
├── README.md                   # Project documentation
└── .gitignore                  # Files ignored by Git

```
## Security Features
- JWT-based authentication
- Password hashing
- Role-based authorization
- Input validation
- CORS protection
- HTTP-only secure cookies

## Authentication
- JWT is used for secure token-based authentication.
- Passwords are hashed with bcryptjs.
- Tokens are stored and validated using `koa-passport`.

## Features
- user management - register, login, update profile
- book management - create, read, update and delete books
- author management - create, read, update and delete authors
- review system - create, read, update and delete reviews for books
- authentication and authorisation: JWT-based authorisation and RBAC authorisation
- input validation
- API Documentation: openapi.yaml (on backend folder)

## Tables in SQL 
- users, authors, genres, books, reviews

## API EndPoints
Authentication
POST /api/v1/users/register - Register a new user
POST /api/v1/users/login - Login and get JWT token

Users
GET /api/v1/users - Get all users (admin only)
GET /api/v1/users/:id - Get user by ID
PUT /api/v1/users/:id - Update user profile
DELETE /api/v1/users/:id - Delete a user (admin only)

Books
GET /api/v1/books - Get all books
GET /api/v1/books/:id - Get book by ID
POST /api/v1/books - Create a new book (admin only)
PUT /api/v1/books/:id - Update a book (admin only)
DELETE /api/v1/books/:id - Delete a book (admin only)

Authors
GET /api/v1/authors - Get all authors
GET /api/v1/authors/:id - Get author by ID
POST /api/v1/authors - Create a new author (admin only)
PUT /api/v1/authors/:id - Update an author (admin only)
DELETE /api/v1/authors/:id - Delete an author (admin only)

Reviews
GET /api/v1/books/:id/reviews - Get all reviews for a book
POST /api/v1/books/:id/reviews - Create a review for a book
PUT /api/v1/books/:id/reviews/:reviewId - Update a review
DELETE /api/v1/books/:id/reviews/:reviewId - Delete a review

Genres
GET /api/v1/genres - Get all genres
GET /api/v1/genres/:id - Get genre by ID
POST /api/v1/genres - Create a new genre (admin only)
PUT /api/v1/genres/:id - Update a genre (admin only)
DELETE /api/v1/genres/:id - Delete a genre (admin only)

## Overall 
- User authentication (register/login)
- Protected routes with JWT
- MySQL integration for persistent data
- Modular API structure
- React SPA with routing and Axios calls
- Environment configuration with `.env` files
- Jest testing for backend logic







