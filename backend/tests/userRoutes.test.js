const request = require('supertest');
const app = require('../app');

describe('User Routes', () => {
  let token;

  // Get auth token for the protected routes
  beforeAll(async () => {
    const res = await request(app.callback())
      .post('/api/v1/users/test-login')
      /*.send({
        username: 'admin',
        password: 'admin123'
      });*/
    token = res.body.token;
    console.log('User test - token received:', token ? 'Yes' : 'No');
  });

  //POST - creates user
  it('should create a new user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: `unique_${Date.now()}`, // Ensures a unique username
        password: 'password123',
        email: `unique_${Date.now()}@example.com`
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created');
  });

  //GET - get all users that have authentication
  it('should get all users with authentication', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  //GET - get a specific user
  it('should get a specific user', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('username');
  });

  //PUT - update a user
  it('should update a user', async () => {
    //creating a user to update
    const createRes = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: `update_user_${Date.now()}`,
        password: 'password123',
        email: `update_${Date.now()}@example.com`
      });

    const userId = createRes.body.id;

    //updates the user
    const res = await request(app.callback())
      .put(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: `updated_user_${Date.now()}`,
        email: `updated_${Date.now()}@example.com`,
        password: 'updatedpassword123' // Include password if required by validation
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('updated', true);
  });

  //DELETE - deletes a user
  it('should delete a user', async () => {
    //creates a user to delete
    const createRes = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: `delete_user_${Date.now()}`,
        password: 'password123',
        email: `delete_${Date.now()}@example.com`
      });

    const userId = createRes.body.id;

    //deletes the user
    const res = await request(app.callback())
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deleted', true);
  });
});

/*describe('User Routes', () => {
  //POST - creates user
  it('should create a new user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: `unique_${Date.now()}`, // Ensures a unique username
        password: 'password123',
        email: `unique_${Date.now()}@example.com`
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created');
  });

  //GET - get all users that have authentication
  it('should get all users with authentication', async () => {
    const loginRes = await request(app.callback())
      .post('/api/v1/users/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    const token = loginRes.body.token;

    //uses token to get users
    const res = await request(app.callback())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  //GET - get a specific user
  it('should get a specific user', async () => {
    //1st login to get token
    const loginRes = await request(app.callback())
      .post('/api/v1/users/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    const token = loginRes.body.token;

    const res = await request(app.callback())
      .get('/api/v1/users/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('username');
  });

  //PUT - update a user
  it('should update a user', async () => {
    const loginRes = await request(app.callback())
      .post('/api/v1/users/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    const token = loginRes.body.token;

    //creating a user to update
    const createRes = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: `update_user_${Date.now()}`,
        password: 'password123',
        email: `update_${Date.now()}@example.com`
      });

    const userId = createRes.body.id;

    //updates the user
    const res = await request(app.callback())
      .put(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: `updated_${Date.now()}@example.com`
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('updated', true);
  });

  //DELETE - deletes a user
  it('should delete a user', async () => {
    const loginRes = await request(app.callback())
      .post('/api/v1/users/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    const token = loginRes.body.token;

    //creates a user to delete
    const createRes = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: `delete_user_${Date.now()}`,
        password: 'password123',
        email: `delete_${Date.now()}@example.com`
      });

    const userId = createRes.body.id;

    //deletes the user
    const res = await request(app.callback())
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deleted', true);
  });
});*/