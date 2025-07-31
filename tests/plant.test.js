const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const server = app.listen(8084, () => console.log('Testing Plants on PORT 8084'));

const User = require('../models/user');
const Plant = require('../models/plant');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
  server.close();
});

afterEach(async () => {
  await User.deleteMany({});
  await Plant.deleteMany({});
});

describe('Plant API Tests', () => {
  let user, token;

  beforeEach(async () => {
    user = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123'
    });
    await user.save();
    token = await user.generateAuthToken();
  });

  // ===========================
  // GET /api/plants
  // ===========================
  describe('GET /api/plants', () => {
    test('should return all plants for authenticated user', async () => {
      await Plant.create([
        { name: 'Plant A', location: 'Bahrain', emissions: 100 },
        { name: 'Plant B', location: 'KSA', emissions: 200 }
      ]);

      const response = await request(app)
        .get('/api/plants')
        .set('Authorization', `Bearer ${token}`)
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
      expect(response.text).toBe('Not authorized');
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
        emissions: 300
      });

      const response = await request(app)
        .get(`/api/plants/${plant._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Test Plant');
      expect(response.body).toHaveProperty('location', 'Dubai');
      expect(response.body).toHaveProperty('emissions', 300);
    });

    test('should return 400 for invalid/non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/plants/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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

      expect(response.text).toBe('Not authorized');
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
        emissions: 800
      });

      const updateData = {
        name: 'Updated Plant E',
        location: 'Kuwait City',
        emissions: 900
      };

      const response = await request(app)
        .put(`/api/plants/${plant._id}`)
        .set('Authorization', `Bearer ${token}`)
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
        emissions: 700
      });

      const response = await request(app)
        .delete(`/api/plants/${plant._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Plant successfully deleted');

      const deletedPlant = await Plant.findById(plant._id);
      expect(deletedPlant).toBeNull();
    });

    test('should return 401 if token is missing', async () => {
      const plant = await Plant.create({
        name: 'Plant G',
        location: 'Saudi Arabia',
        emissions: 1000
      });

      const response = await request(app)
        .delete(`/api/plants/${plant._id}`)
        .expect(401);

      expect(response.text).toBe('Not authorized');
    });
  });
});
