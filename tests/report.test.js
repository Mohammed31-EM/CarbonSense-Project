// tests/report.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/user');
const Plant = require('../models/plant');
const Report = require('../models/report');

let server;
let mongoServer;
let token, userId, plant;

// Helper: Register and login, return JWT and userId
async function registerAndLoginUser() {
  const user = { name: 'Test User', email: 'testuser@example.com', password: 'password123' };
  await request(app).post('/api/users').send(user);
  const res = await request(app).post('/api/users/login').send({
    email: user.email,
    password: user.password,
  });
  userId = res.body.user._id;
  return res.body.token;
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  server = app.listen(8091, () => console.log('Testing Report API on PORT 8091'));
});

afterAll(async () => {
  await Report.deleteMany({});
  await Plant.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
  await server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Plant.deleteMany({});
  await Report.deleteMany({});

  // Register user and login for JWT
  token = await registerAndLoginUser();

  // Create a plant linked to user
  plant = await Plant.create({
    name: 'Bahrain Plant',
    location: 'Manama',
    emissions: 100,
    status: 'Active',
    user: userId
  });
});

describe('📊 Report API Tests', () => {
  test('✅ should create a new report successfully', async () => {
    const data = {
      plantId: plant._id.toString(),
      periodStart: '2025-01-01',
      periodEnd: '2025-12-31'
    };

    const response = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send(data)
      .expect(201);

    expect(response.body).toHaveProperty('plantId', plant._id.toString());
    expect(response.body.metrics).toHaveProperty('carbonFootprint');
  });

  test('✅ should return all reports', async () => {
    // Create one report first for this plant
    await Report.create({
      plantId: plant._id,
      generatedBy: userId,
      periodStart: '2025-01-01',
      periodEnd: '2025-12-31',
      metrics: { carbonFootprint: 1000 }
    });

    const response = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  test('✅ should get a single report by ID', async () => {
    const report = await Report.create({
      plantId: plant._id,
      generatedBy: userId,
      periodStart: '2025-01-01',
      periodEnd: '2025-12-31',
      metrics: { carbonFootprint: 1000 }
    });

    const response = await request(app)
      .get(`/api/reports/${report._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('plantId', plant._id.toString());
    expect(response.body.metrics.carbonFootprint).toBe(1000);
  });

  test('🚫 should return 400 for invalid/non-existent ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/api/reports/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  test('✅ should delete a report successfully', async () => {
    const report = await Report.create({
      plantId: plant._id,
      generatedBy: userId,
      periodStart: '2025-01-01',
      periodEnd: '2025-12-31',
      metrics: { carbonFootprint: 1000 }
    });

    const response = await request(app)
      .delete(`/api/reports/${report._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Report successfully deleted');
    const deletedReport = await Report.findById(report._id);
    expect(deletedReport).toBeNull();
  });
});
