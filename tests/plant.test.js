const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const server = app.listen(8084, () => console.log('Testing Plants on PORT 8084'));

const User = require('../models/user');
const Plant = require('../models/plant');

let mongoServer, token, userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

afterEach(async () => {
  await User.deleteMany({});
  await Plant.deleteMany({});
});

// Register and login one user for all tests
beforeEach(async () => {
  const userData = { name: 'Test User', email: 'testuser@example.com', password: 'password123' };
  await request(app).post('/api/users').send(userData);
  const loginRes = await request(app).post('/api/users/login').send({ email: userData.email, password: userData.password });
  token = `Bearer ${loginRes.body.token}`;
  userId = loginRes.body.user._id;
});

describe('Plant API Tests', () => {
  // ===========================
  // GET /api/plants
  // ===========================
  describe('GET /api/plants', () => {
    test('should return all plants for authenticated user', async () => {
      await Plant.create([
        { name: 'Plant A', location: 'Bahrain', emissions: 100, user: userId },
        { name: 'Plant B', location: 'KSA', emissions: 200, user: userId }
      ]);

      const response = await request(app)
        .get('/api/plants')
        .set('Authorization', token)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('location');
      expect(response.body[0]).toHaveProperty('emissions');
    });

    test('should return 401 if token is missing', async () => {
      const response = await request(app)
        .get('/api/plants')
        .expect(401);
      expect(response.text).toBe('Token missing');
    });
  });

  // ===========================
  // GET /api/plants/:id
  // ===========================
  describe('GET /api/plants/:id', () => {
    test('should get a single plant by ID', async () => {
      const plant = await Plant.create({
        name: 'Test Plant',
        location: 'Dubai',
        emissions: 300,
        user: userId
      });

      const response = await request(app)
        .get(`/api/plants/${plant._id}`)
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Test Plant');
      expect(response.body).toHaveProperty('location', 'Dubai');
      expect(response.body).toHaveProperty('emissions', 300);
    });

    test('should return 400 for invalid/non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/plants/${fakeId}`)
        .set('Authorization', token)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  // ===========================
  // POST /api/plants
  // ===========================
  describe('POST /api/plants', () => {
    test('should create a new plant successfully', async () => {
      const plantData = {
        name: 'Plant C',
        location: 'Qatar',
        emissions: 500
      };

      const response = await request(app)
        .post('/api/plants')
        .set('Authorization', token)
        .send(plantData)
        .expect(201);

      expect(response.body).toHaveProperty('name', plantData.name);
      expect(response.body).toHaveProperty('location', plantData.location);
      expect(response.body).toHaveProperty('emissions', plantData.emissions);
    });

    test('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/plants')
        .send({ name: 'Plant D', location: 'Oman', emissions: 600 })
        .expect(401);

      expect(response.text).toBe('Token missing');
    });
  });

  // ===========================
  // PUT /api/plants/:id
  // ===========================
  describe('PUT /api/plants/:id', () => {
    test('should update a plant successfully', async () => {
      const plant = await Plant.create({
        name: 'Plant E',
        location: 'Kuwait',
        emissions: 800,
        user: userId
      });

      const updateData = {
        name: 'Updated Plant E',
        location: 'Kuwait City',
        emissions: 900
      };

      const response = await request(app)
        .put(`/api/plants/${plant._id}`)
        .set('Authorization', token)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('name', updateData.name);
      expect(response.body).toHaveProperty('location', updateData.location);
      expect(response.body).toHaveProperty('emissions', updateData.emissions);
    });
  });

  // ===========================
  // DELETE /api/plants/:id
  // ===========================
  describe('DELETE /api/plants/:id', () => {
    test('should delete a plant successfully', async () => {
      const plant = await Plant.create({
        name: 'Plant F',
        location: 'Jordan',
        emissions: 700,
        user: userId
      });

      const response = await request(app)
        .delete(`/api/plants/${plant._id}`)
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Plant successfully deleted');

      const deletedPlant = await Plant.findById(plant._id);
      expect(deletedPlant).toBeNull();
    });

    test('should return 401 if token is missing', async () => {
      const plant = await Plant.create({
        name: 'Plant G',
        location: 'Saudi Arabia',
        emissions: 1000,
        user: userId
      });

      const response = await request(app)
        .delete(`/api/plants/${plant._id}`)
        .expect(401);

      expect(response.text).toBe('Token missing');
    });
  });
});
