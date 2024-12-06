const request = require('supertest');
const app = require('../index'); 

describe('API Tests', () => {
  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'test', password: '12345' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Usuario registrado');
  });

  it('should login a user', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'test', password: '12345' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fetch products with valid token', async () => {
    const login = await request(app).post('/api/auth/login').send({ username: 'test', password: '12345' });
    const token = login.body.token;

    const res = await request(app).get('/api/products').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('should fail to fetch products without token', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(403);
  });
});
