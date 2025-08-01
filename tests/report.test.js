const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const server = app.listen(8091, () => console.log('Testing Report API on PORT 8091'));

const User = require('../models/user');
const Plant = require('../models/plant');
const Report = require('../models/report');

let mongoServer;
let token, user, plant;

jest.setTimeout(30000); // Increase timeout for DB operations

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
  await User.deleteMany();
  await Plant.deleteMany();
  await Report.deleteMany();
});

describe('📊 Report API Tests', () => {
  beforeEach(async () => {
    // Create user
    user = new User({
      name: 'Report Admin',
      email: 'reportadmin@example.com',
      password: 'password123'
    });
    await user.save();
    token = await user.generateAuthToken();

    // Create plant
    plant = await Plant.create({
      name: 'Bahrain Plant',
      location: 'Manama',
      emissions: 100,
      status: 'Active'
    });
  });

  // ===========================
  // ✅ CREATE REPORT
  // ===========================
  test('✅ should create a new report successfully', async () => {
    const reportData = {
      plantId: plant._id.toString(),
      generatedBy: user._id.toString(),
      periodStart: '2025-07-01',
      periodEnd: '2025-07-31',
      metrics: {
        totalEmissions: 100,
        totalEnergy: 5000,
        waterUsage: 200,
        waste: 50,
        carbonFootprint: 1000
      }
    };

    const response = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send(reportData)
      .expect(201);

    expect(response.body).toHaveProperty('plantId', plant._id.toString());
    expect(response.body.metrics.carbonFootprint).toBe(1000);
  });

  test('🚫 should return 401 when creating a report without token', async () => {
    const response = await request(app)
      .post('/api/reports')
      .send({
        plantId: plant._id,
        generatedBy: user._id,
        periodStart: '2025-07-01',
        periodEnd: '2025-07-31'
      })
      .expect(401);

    expect(response.text).toBe('Not authorized');
  });

  // ===========================
  // ✅ GET ALL REPORTS
  // ===========================
  test('✅ should get all reports for authenticated user', async () => {
    await Report.create({
      plantId: plant._id,
      generatedBy: user._id,
      periodStart: '2025-07-01',
      periodEnd: '2025-07-31',
      metrics: { carbonFootprint: 1000 }
    });

    const response = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  // ===========================
  // ✅ GET SINGLE REPORT
  // ===========================
  test('✅ should get a single report by ID', async () => {
    const report = await Report.create({
      plantId: plant._id,
      generatedBy: user._id,
      periodStart: '2025-07-01',
      periodEnd: '2025-07-31',
      metrics: { carbonFootprint: 1000 }
    });

    const response = await request(app)
      .get(`/api/reports/${report._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.plantId._id).toBe(plant._id.toString());
    expect(response.body.metrics.carbonFootprint).toBe(1000);
  });

  test('🚫 should return 404 for invalid/non-existent ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/api/reports/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(response.body).toHaveProperty('message');
  });

  // ===========================
  // ✅ UPDATE REPORT
  // ===========================
  test('✅ should update a report successfully', async () => {
    const report = await Report.create({
      plantId: plant._id,
      generatedBy: user._id,
      periodStart: '2025-07-01',
      periodEnd: '2025-07-31',
      metrics: { carbonFootprint: 1000 }
    });

    const response = await request(app)
      .put(`/api/reports/${report._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ metrics: { carbonFootprint: 2000 } })
      .expect(200);

    expect(response.body.metrics.carbonFootprint).toBe(2000);
  });

  // ===========================
  // ✅ DELETE REPORT
  // ===========================
  test('✅ should delete a report successfully', async () => {
    const report = await Report.create({
      plantId: plant._id,
      generatedBy: user._id,
      periodStart: '2025-07-01',
      periodEnd: '2025-07-31',
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
