const request = require('supertest');
const app = require('../app');

describe('Genre Routes', () => {
  let token;

  //get auth token for protected routes
  beforeAll(async () => {
    const res = await request(app.callback())
      .post('/api/v1/users/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    token = res.body.token;
  });

  //GET - get all genres
  it('should get all genres', async () => {
    const res = await request(app.callback())
      .get('/api/v1/genres');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  //GET - get a specific genre
  it('should get a specific genre', async () => {
    const res = await request(app.callback())
      .get('/api/v1/genres/1');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('name');
  });

  //POST - create a genre
  it('should create a new genre', async () => {
    const res = await request(app.callback())
      .post('/api/v1/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Genre ${Date.now()}`
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('created', true);
  });

  //PUT - update a genre
  it('should update a genre', async () => {
    //create a genre to update
    const createRes = await request(app.callback())
      .post('/api/v1/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Update Genre ${Date.now()}`
      });
    
    const genreId = createRes.body.ID;
    
    //update the genre
    const res = await request(app.callback())
      .put(`/api/v1/genres/${genreId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Updated Genre ${Date.now()}`
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('updated', true);
  });

  //DELETE - delete a genre
  it('should delete a genre', async () => {
    //create a genre to delete
    const createRes = await request(app.callback())
      .post('/api/v1/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Delete Genre ${Date.now()}`
      });
    
    const genreId = createRes.body.ID;
    
    //deletes the genre
    const res = await request(app.callback())
      .delete(`/api/v1/genres/${genreId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deleted', true);
  });
});