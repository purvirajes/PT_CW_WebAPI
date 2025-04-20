const request = require('supertest');
const app = require('../app');

describe('Book Routes', () => {
  let token;

  // Get auth token for the protected routes - using the test login route
  beforeAll(async () => {
    console.log('Getting test token');
    const res = await request(app.callback())
      .post('/api/v1/users/test-login'); // Use the test login route
      
    console.log('Test login response status:', res.status);
    token = res.body.token;
    console.log('Token received:', token ? 'Yes' : 'No');
  });

  //GET - gets all the books
  it('should get all books', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  //GET - gets a specific book
  it('should get a specific book', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books/1');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('title');
  });

  //POST - creates a book
  it('should create a new book', async () => {
    console.log('Creating a book with token');
    const res = await request(app.callback())
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Test Book ${Date.now()}`,
        summary: 'A test book created by automated testing',
        authorID: 1,
        imageURL: 'https://covers.openlibrary.org/b/id/12345678-L.jpg'
      });
    
    console.log('Book creation response:', res.status, res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('created', true);
  });

  // PUT - updates a book
  it('should update a book', async () => {
    //create a book to update
    const createRes = await request(app.callback())
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Update Book ${Date.now()}`,
        summary: 'A book that will be updated',
        authorID: 1,
        imageURL: 'https://covers.openlibrary.org/b/id/12345678-L.jpg'
      });
    
    const bookId = createRes.body.ID;
    
    //updates the book
    const res = await request(app.callback())
      .put(`/api/v1/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Updated Book ${Date.now()}`,
        summary: 'This book has been updated',
        authorID: 1,
        imageURL: 'https://covers.openlibrary.org/b/id/12345678-L.jpg'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('updated', true);
  });

  //DELETE - deletes a book
  it('should delete a book', async () => {
    //create a book to delete
    const createRes = await request(app.callback())
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Delete Book ${Date.now()}`,
        summary: 'A book that will be deleted',
        authorID: 1,
        imageURL: 'https://covers.openlibrary.org/b/id/12345678-L.jpg'
      });
    
    const bookId = createRes.body.ID;
    
    //deletes the book
    const res = await request(app.callback())
      .delete(`/api/v1/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deleted', true);
  });
});

  //get auth token for the protected routes
  /*beforeAll(async () => {
    const res = await request(app.callback())
      .post('/api/v1/users/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    token = res.body.token;
  });

  //GET - gets all the books
  it('should get all books', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  //GET - gets a specific book
  it('should get a specific book', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books/1');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('title');
  });

  //POST - creates a book
  it('should create a new book', async () => {
    const res = await request(app.callback())
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Test Book ${Date.now()}`,
        summary: 'A test book created by automated testing',
        authorID: 1,
        imageURL: 'https://covers.openlibrary.org/b/id/12345678-L.jpg'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('created', true);
  });

  // PUT - updates a book
  it('should update a book', async () => {
    //create a book to update
    const createRes = await request(app.callback())
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Update Book ${Date.now()}`,
        summary: 'A book that will be updated',
        authorID: 1,
        imageURL: 'https://covers.openlibrary.org/b/id/12345678-L.jpg'
      });
    
    const bookId = createRes.body.ID;
    
    //updates the book
    const res = await request(app.callback())
      .put(`/api/v1/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Updated Book ${Date.now()}`,
        summary: 'This book has been updated',
        authorID: 1,
        imageURL: 'https://covers.openlibrary.org/b/id/12345678-L.jpg'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('updated', true);
  });

  //DELETE - deletes a book
  it('should delete a book', async () => {
    //create a book to delete
    const createRes = await request(app.callback())
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Delete Book ${Date.now()}`,
        summary: 'A book that will be deleted',
        authorID: 1,
        imageURL: 'https://covers.openlibrary.org/b/id/12345678-L.jpg'
      });
    
    const bookId = createRes.body.ID;
    
    //deletes the book
    const res = await request(app.callback())
      .delete(`/api/v1/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deleted', true);
  });
});*/