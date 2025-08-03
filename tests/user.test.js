// tests/user.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/user');

let mongoServer;
let token;

// --- Helper: Register and Login a user, return token
async function registerAndLoginUser(userData = {
  name: 'Test User', email: 'test@example.com', password: 'testpass123'
}) {
  await request(app).post('/api/users').send(userData);
  const res = await request(app).post('/api/users/login').send({
    email: userData.email,
    password: userData.password,
  });
  return res.body.token;
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('👤 User API', () => {
  beforeEach(async () => {
    token = await registerAndLoginUser();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Another User',
        email: 'another@example.com',
        password: 'anotherpass123'
      })
      .expect(201);

    expect(res.body).toHaveProperty('user');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body).toHaveProperty('token');
  });

  it('should not allow duplicate registration', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'Dup', email: 'dup@example.com', password: 'pass' });

    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Dup', email: 'dup@example.com', password: 'pass' })
      .expect(400);

    // Should match "already exists" or "User already exists"
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should login a user and receive a token', async () => {
    // Register a new user for login
    await request(app)
      .post('/api/users')
      .send({ name: 'Log', email: 'log@example.com', password: 'testpass' });

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'log@example.com', password: 'testpass' })
      .expect(200);

    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'No', email: 'no@example.com', password: 'rightpass' });

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'no@example.com', password: 'wrongpass' })
      .expect(400);

    expect(res.body.message).toMatch(/invalid/i);
  });

  it('should get user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.user).toHaveProperty('email', 'test@example.com');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should fail to get profile with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer badtoken')
      .expect(401);

    expect(res.text).toMatch(/not authorized|token/i);
  });
});
