const request = require('supertest');
const app = require('../app');

describe('Author Routes', () => {
  let token;

  //get auth token for protected routes
  beforeAll(async () => {
    const res = await request(app.callback())
      .post('/api/v1/users/test-login'); // Use test login instead
    token = res.body.token;
  });

  //GET - get all authors
  it('should get all authors', async () => {
    const res = await request(app.callback())
      .get('/api/v1/authors');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  //GET - get a specific author
  it('should get a specific author', async () => {
    const res = await request(app.callback())
      .get('/api/v1/authors/1');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('name');
  });

  //POST - create an author
  it('should create a new author', async () => {
    const res = await request(app.callback())
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Author ${Date.now()}`,
        bio: 'A test author created by automated testing'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('created', true);
  });

  //PUT - update an author
  it('should update an author', async () => {
    //create an author to update
    const createRes = await request(app.callback())
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Update Author ${Date.now()}`,
        bio: 'An author that will be updated'
      });
    
    const authorId = createRes.body.id;
    
    //update the author
    const res = await request(app.callback())
      .put(`/api/v1/authors/${authorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Updated Author ${Date.now()}`,
        bio: 'This author has been updated'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('updated', true);
  });

  //DELETE - delete an author
  it('should delete an author', async () => {
    //creates an author to delete
    const createRes = await request(app.callback())
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Delete Author ${Date.now()}`,
        bio: 'An author that will be deleted'
      });
    
    const authorId = createRes.body.id;
    
    //deletes the author
    const res = await request(app.callback())
      .delete(`/api/v1/authors/${authorId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deleted', true);
  });
});
  //get auth token for protected routes
  /*beforeAll(async () => {
    const res = await request(app.callback())
      .post('/api/v1/users/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    token = res.body.token;
  });

  //GET - get all authors
  it('should get all authors', async () => {
    const res = await request(app.callback())
      .get('/api/v1/authors');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  //GET - get a specific author
  it('should get a specific author', async () => {
    const res = await request(app.callback())
      .get('/api/v1/authors/1');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('name');
  });

  //POST - create an author
  it('should create a new author', async () => {
    const res = await request(app.callback())
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Author ${Date.now()}`,
        bio: 'A test author created by automated testing'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('created', true);
  });

  //PUT - update an author
  it('should update an author', async () => {
    //create an author to update
    const createRes = await request(app.callback())
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Update Author ${Date.now()}`,
        bio: 'An author that will be updated'
      });
    
    const authorId = createRes.body.ID;
    
    //update the author
    const res = await request(app.callback())
      .put(`/api/v1/authors/${authorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Updated Author ${Date.now()}`,
        bio: 'This author has been updated'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('updated', true);
  });

  //DELETE - delete an author
  it('should delete an author', async () => {
    //creates an author to delete
    const createRes = await request(app.callback())
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Delete Author ${Date.now()}`,
        bio: 'An author that will be deleted'
      });
    
    const authorId = createRes.body.ID;
    
    //deletes the author
    const res = await request(app.callback())
      .delete(`/api/v1/authors/${authorId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deleted', true);
  });
});*/