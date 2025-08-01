const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const server = app.listen(8091, () => console.log('Testing Report API on PORT 8091'));

const User = require('../models/user');
const Plant = require('../models/plant');
const Report = require('../models/report');

let mongoServer;
let user, token, plant;

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
  await Report.deleteMany({});
});

describe('📊 Report API Tests', () => {
  beforeEach(async () => {
    user = new User({
      name: 'Report Tester',
      email: 'report@example.com',
      password: 'password123'
    });
    await user.save();
    token = await user.generateAuthToken();

    plant = await Plant.create({
      name: 'Bahrain Plant',
      location: 'Manama',
      emissions: 100,
      status: 'Active'
    });
  });

  // ✅ CREATE REPORT
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

  // ✅ GET REPORTS
  test('✅ should return all reports', async () => {
    await Report.create({
      plantId: plant._id,
      generatedBy: new mongoose.Types.ObjectId(),
      periodStart: '2025-01-01',
      periodEnd: '2025-12-31',
      metrics: { carbonFootprint: 500 }
    });

    const response = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  // ✅ GET SINGLE REPORT
  test('✅ should get a single report by ID', async () => {
    const report = await Report.create({
      plantId: plant._id,
      generatedBy: new mongoose.Types.ObjectId(),
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

  // ✅ DELETE REPORT
  test('✅ should delete a report successfully', async () => {
    const report = await Report.create({
      plantId: plant._id,
      generatedBy: new mongoose.Types.ObjectId(),
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
