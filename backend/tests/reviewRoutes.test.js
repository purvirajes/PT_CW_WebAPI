const request = require('supertest');
const app = require('../app');

describe('Review Routes', () => {
  let token;

  //gets the auth token for protected routes
  beforeAll(async () => {
    const res = await request(app.callback())
      .post('/api/v1/users/test-login')
      /*.send({
        username: 'admin',
        password: 'admin123'
      });*/
    token = res.body.token;
    console.log('Test token received:', token ? 'Yes' : 'No');
  });

  //GET - gets all reviews for a book
  it('should get all reviews for a book', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books/1/reviews');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  //POST - creates a review
  it('should create a new review', async () => {
    const res = await request(app.callback())
      .post('/api/v1/books/1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: `Test review ${Date.now()}`,
        userID: 1,
        bookID: 1,
        rating: 4
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Review created');
  });

  //GET - gets a specific review
  it('should get a specific review', async () => {
    // First create a review
    const createRes = await request(app.callback())
      .post('/api/v1/books/1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: `Review to get ${Date.now()}`,
        userID: 1,
        bookID: 1,
        rating: 5
      });
    
    const reviewId = createRes.body.id;
    
    //gets the review
    const res = await request(app.callback())
      .get(`/api/v1/books/1/reviews/${reviewId}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('content');
  });

  //PUT - updates a review
  it('should update a review', async () => {
    //creates a review to update
    const createRes = await request(app.callback())
      .post('/api/v1/books/1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: `Review to update ${Date.now()}`,
        userID: 1,
        bookID: 1,
        rating: 3
      });
    
    const reviewId = createRes.body.id;
    
    //updates the review
    const res = await request(app.callback())
      .put(`/api/v1/books/1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: `Updated review ${Date.now()}`,
        rating: 4,
        userID: 1,    // Add userID if required by validation
        bookID: 1     // Add bookID if required by validation
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review updated');
  });

  //DELETE - deletes a review
  it('should delete a review', async () => {
    //creates a review to delete
    const createRes = await request(app.callback())
      .post('/api/v1/books/1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: `Review to delete ${Date.now()}`,
        userID: 1,
        bookID: 1,
        rating: 2
      });
    
    const reviewId = createRes.body.id;
    
    //deletes the review
    const res = await request(app.callback())
      .delete(`/api/v1/books/1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review deleted');
  });
});

  //gets the auth token for protected routes
  /*beforeAll(async () => {
    const res = await request(app.callback())
      .post('/api/v1/users/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    token = res.body.token;
  });

  //GET - gets all reviews for a book
  it('should get all reviews for a book', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books/1/reviews');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  //POST - creates a review
  it('should create a new review', async () => {
    const res = await request(app.callback())
      .post('/api/v1/books/1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: `Test review ${Date.now()}`,
        userID: 1,
        bookID: 1,
        rating: 4
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Review created');
  });

  //GET - gets a specific review
  it('should get a specific review', async () => {
    // First create a review
    const createRes = await request(app.callback())
      .post('/api/v1/books/1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: `Review to get ${Date.now()}`,
        userID: 1,
        bookID: 1,
        rating: 5
      });
    
    const reviewId = createRes.body.id;
    
    //gets the review
    const res = await request(app.callback())
      .get(`/api/v1/books/1/reviews/${reviewId}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('content');
  });

  //PUT - updates a review
  it('should update a review', async () => {
    //creates a review to update
    const createRes = await request(app.callback())
      .post('/api/v1/books/1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: `Review to update ${Date.now()}`,
        userID: 1,
        bookID: 1,
        rating: 3
      });
    
    const reviewId = createRes.body.id;
    
    //updates the review
    const res = await request(app.callback())
      .put(`/api/v1/books/1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: `Updated review ${Date.now()}`,
        rating: 4
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review updated');
  });

  //DELETE - deletes a review
  it('should delete a review', async () => {
    //creates a review to delete
    const createRes = await request(app.callback())
      .post('/api/v1/books/1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: `Review to delete ${Date.now()}`,
        userID: 1,
        bookID: 1,
        rating: 2
      });
    
    const reviewId = createRes.body.id;
    
    //deletes the review
    const res = await request(app.callback())
      .delete(`/api/v1/books/1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review deleted');
  });
});*/