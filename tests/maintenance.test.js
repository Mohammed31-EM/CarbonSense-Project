const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/user');
const Plant = require('../models/plant');
const Equipment = require('../models/equipment');
const Maintenance = require('../models/maintenance');

let mongoServer;
let server;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  server = app.listen(8086, () => console.log('Testing Maintenance on PORT 8086'));
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
  server.close();
});

afterEach(async () => {
  await User.deleteMany({});
  await Plant.deleteMany({});
  await Equipment.deleteMany({});
  await Maintenance.deleteMany({});
});

describe('Maintenance API Tests', () => {
  let token, plant, equipment;

  beforeEach(async () => {
    const user = new User({ name: 'Tech', email: 'tech@cs.com', password: 'pass123' });
    await user.save();
    token = await user.generateAuthToken();

    plant = await Plant.create({ name: 'Plant Z', location: 'Qatar', emissions: 300 });
    equipment = await Equipment.create({ name: 'Pump-1', type: 'Pump', plantId: plant._id });
  });

  test('should create a new maintenance log successfully', async () => {
    const data = {
      equipmentId: equipment._id,
      plantId: plant._id,
      tasksPerformed: ['Lubricate Bearings'],
      status: 'Pending'
    };

    const response = await request(app)
      .post('/api/maintenance')
      .set('Authorization', `Bearer ${token}`)
      .send(data)
      .expect(201);

    expect(response.body.tasksPerformed).toContain('Lubricate Bearings');
    expect(response.body.status).toBe('Pending');
  });

  test('should return all maintenance logs', async () => {
    await Maintenance.create({
      equipmentId: equipment._id,
      plantId: plant._id,
      tasksPerformed: ['Inspect Motor'],
      status: 'Completed'
    });

    const response = await request(app)
      .get('/api/maintenance')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});
