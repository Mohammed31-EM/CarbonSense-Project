const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const server = app.listen(8090, () => console.log('Testing Reading API on PORT 8090'));

const User = require('../models/user');
const Plant = require('../models/plant');
const Equipment = require('../models/equipment');
const Reading = require('../models/reading');

let mongoServer;
let token, user, plant, equipment;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Plant.deleteMany({});
  await Equipment.deleteMany({});
  await Reading.deleteMany({});

  // Register user via API
  await request(app)
    .post('/api/users')
    .send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    });

  // Login user via API
  const loginRes = await request(app)
    .post('/api/users/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123'
    });

  token = `Bearer ${loginRes.body.token}`;
  user = loginRes.body.user;

  // Create plant and equipment with user ownership
  plant = await Plant.create({
    name: 'Test Plant',
    location: 'Bahrain',
    emissions: 100,
    user: user._id // assign ownership
  });

  equipment = await Equipment.create({
    name: 'Sensor 1',
    type: 'IoT Sensor',
    plantId: plant._id
  });
});

describe('📊 Reading API Tests', () => {
  test('✅ should create a new reading successfully', async () => {
    const data = {
      equipmentId: equipment._id,
      parameter: 'energy',
      value: 200
    };

    const response = await request(app)
      .post('/api/readings')
      .set('Authorization', token)
      .send(data)
      .expect(201);

    expect(response.body).toHaveProperty('parameter', 'energy');
    expect(response.body).toHaveProperty('value', 200);
  });

  test('🚫 should return 401 without token', async () => {
    const response = await request(app)
      .post('/api/readings')
      .send({
        equipmentId: equipment._id,
        parameter: 'emissions',
        value: 50
      })
      .expect(401);

    expect(response.text).toMatch(/token/i);
  });

  test('✅ should return all readings for authenticated user', async () => {
    await Reading.create([
      { equipmentId: equipment._id, parameter: 'energy', value: 150 },
      { equipmentId: equipment._id, parameter: 'water', value: 75 }
    ]);

    const response = await request(app)
      .get('/api/readings')
      .set('Authorization', token)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  test('✅ should return a specific reading', async () => {
    const reading = await Reading.create({
      equipmentId: equipment._id,
      parameter: 'waste',
      value: 10
    });

    const response = await request(app)
      .get(`/api/readings/${reading._id}`)
      .set('Authorization', token)
      .expect(200);

    expect(response.body).toHaveProperty('parameter', 'waste');
    expect(response.body).toHaveProperty('value', 10);
  });

  test('🚫 should return 404 for invalid/non-existent ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/api/readings/${fakeId}`)
      .set('Authorization', token)
      .expect(404);

    expect(response.body).toHaveProperty('message');
  });

  test('✅ should update a reading successfully', async () => {
    const reading = await Reading.create({
      equipmentId: equipment._id,
      parameter: 'emissions',
      value: 100
    });

    const response = await request(app)
      .put(`/api/readings/${reading._id}`)
      .set('Authorization', token)
      .send({ value: 300 })
      .expect(200);

    expect(response.body).toHaveProperty('value', 300);
  });

  test('✅ should delete a reading successfully', async () => {
    const reading = await Reading.create({
      equipmentId: equipment._id,
      parameter: 'energy',
      value: 400
    });

    const response = await request(app)
      .delete(`/api/readings/${reading._id}`)
      .set('Authorization', token)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Reading deleted successfully');

    const deletedReading = await Reading.findById(reading._id);
    expect(deletedReading).toBeNull();
  });

  test('🚫 should return 401 without token (delete)', async () => {
    const reading = await Reading.create({
      equipmentId: equipment._id,
      parameter: 'water',
      value: 500
    });

    const response = await request(app)
      .delete(`/api/readings/${reading._id}`)
      .expect(401);

    expect(response.text).toMatch(/token/i);
  });
});
