const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Plant = require('../models/plant');
const Report = require('../models/report');

let server;
let mongoServer;
let plant;
let token = "Bearer faketoken"; // Replace with real token if auth middleware requires it

beforeAll(async () => {
  // Start app server
  server = app.listen(8091, () => console.log('Testing Report API on PORT 8091'));

  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test plant
  plant = await Plant.create({
    name: 'Bahrain Plant',
    location: 'Manama',
    emissions: 100,
    status: 'Active'
  });
});

afterAll(async () => {
  await Report.deleteMany({});
  await Plant.deleteMany({});
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
  await server.close();
});

/**
 * ✅ Test: Create a new report
 */
test('📊 Report API Tests › ✅ should create a new report successfully', async () => {
  const data = {
    plantId: plant._id.toString(),
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31'
  };

  const response = await request(server)
    .post('/api/reports')
    .set('Authorization', token)
    .send(data)
    .expect(201);

  expect(response.body).toHaveProperty('plantId', plant._id.toString());
  expect(response.body.metrics).toHaveProperty('carbonFootprint');
});

/**
 * ✅ Test: Get all reports
 */
test('📊 Report API Tests › ✅ should return all reports', async () => {
  const response = await request(server)
    .get('/api/reports')
    .set('Authorization', token)
    .expect(200);

  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toBeGreaterThanOrEqual(1);
});

/**
 * ✅ Test: Get a single report by ID
 */
test('📊 Report API Tests › ✅ should get a single report by ID', async () => {
  const report = await Report.create({
    plantId: plant._id,
    generatedBy: new mongoose.Types.ObjectId(),
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    metrics: { carbonFootprint: 1000 }
  });

  const response = await request(server)
    .get(`/api/reports/${report._id}`)
    .set('Authorization', token)
    .expect(200);

  expect(response.body).toHaveProperty('plantId', plant._id.toString());
  expect(response.body.metrics.carbonFootprint).toBe(1000);
});

/**
 * ✅ Test: Invalid ID returns 400
 */
test('📊 Report API Tests › 🚫 should return 400 for invalid/non-existent ID', async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const response = await request(server)
    .get(`/api/reports/${fakeId}`)
    .set('Authorization', token)
    .expect(400);

  expect(response.body).toHaveProperty('message');
});

/**
 * ✅ Test: Delete a report
 */
test('📊 Report API Tests › ✅ should delete a report successfully', async () => {
  const report = await Report.create({
    plantId: plant._id,
    generatedBy: new mongoose.Types.ObjectId(),
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    metrics: { carbonFootprint: 1000 }
  });

  const response = await request(server)
    .delete(`/api/reports/${report._id}`)
    .set('Authorization', token)
    .expect(200);

  expect(response.body).toHaveProperty('message', 'Report successfully deleted');
  const deletedReport = await Report.findById(report._id);
  expect(deletedReport).toBeNull();
});
