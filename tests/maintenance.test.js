const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const server = app.listen(8086, () => console.log('Testing Maintenance on PORT 8086'));

const User = require('../models/user');
const Plant = require('../models/plant');
const Equipment = require('../models/equipment');
const Maintenance = require('../models/maintenance');

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
  await Maintenance.deleteMany({});

  // Create user
  user = new User({ name: 'John', email: 'john@test.com', password: 'pass123' });
  await user.save();
  token = await user.generateAuthToken();

  // Create plant
  plant = await Plant.create({
    name: 'Plant A',
    location: 'Site 1',
    emissions: 100,
    status: 'Active'
  });

  // Create equipment
  equipment = await Equipment.create({
    name: 'Pump A',
    type: 'Pump',
    plantId: plant._id
  });
});

describe('Maintenance API Tests', () => {

  test('should create a new maintenance log successfully', async () => {
    const response = await request(app)
      .post('/api/maintenance')
      .set('Authorization', `Bearer ${token}`)
      .send({
        equipmentId: equipment._id,
        plantId: plant._id,
        tasksPerformed: ['Lubricate Bearings'],
        status: 'Pending'
      })
      .expect(201);

    expect(response.body).toHaveProperty('tasksPerformed');
    expect(response.body.tasksPerformed).toContain('Lubricate Bearings');
    expect(response.body.status).toBe('Pending');
  });

  test('should return all maintenance logs', async () => {
    await Maintenance.create({
      equipmentId: equipment._id,
      plantId: plant._id,
      tasksPerformed: ['Inspect Motor'],
      status: 'Pending'
    });

    const response = await request(app)
      .get('/api/maintenance')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  test('should get a single maintenance log by ID', async () => {
    const log = await Maintenance.create({
      equipmentId: equipment._id,
      plantId: plant._id,
      tasksPerformed: ['Inspect Motor'],
      status: 'Pending'
    });

    const response = await request(app)
      .get(`/api/maintenance/${log._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.tasksPerformed).toContain('Inspect Motor');
    expect(response.body.status).toBe('Pending');
  });

  test('should return 400 for non-existent maintenance log ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/api/maintenance/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  test('should update a maintenance log successfully', async () => {
    const log = await Maintenance.create({
      equipmentId: equipment._id,
      plantId: plant._id,
      tasksPerformed: ['Test Pump'],
      status: 'Pending'
    });

    const response = await request(app)
      .put(`/api/maintenance/${log._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        tasksPerformed: ['Replace Seal'],
        status: 'Completed'
      })
      .expect(200);

    expect(response.body.tasksPerformed).toContain('Replace Seal');
    expect(response.body.status).toBe('Completed');
  });

  test('should delete a maintenance log successfully', async () => {
    const log = await Maintenance.create({
      equipmentId: equipment._id,
      plantId: plant._id,
      tasksPerformed: ['Test Delete'],
      status: 'Pending'
    });

    const response = await request(app)
      .delete(`/api/maintenance/${log._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Maintenance record deleted successfully');

    const deletedLog = await Maintenance.findById(log._id);
    expect(deletedLog).toBeNull();
  });

  test('should return 401 without token', async () => {
    const response = await request(app)
      .get('/api/maintenance')
      .expect(401);

    expect(response.text).toBe('Not authorized');
  });
});
