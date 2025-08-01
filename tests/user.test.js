const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

const User = require('../models/user');
const Plant = require('../models/plant');
const Equipment = require('../models/equipment');
const Report = require('../models/report');

let mongoServer;
let server;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  server = app.listen(8081, () => console.log('CarbonSense Testing on PORT 8081'));
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
  await Report.deleteMany({});
});

describe('🌍 CarbonSense API Tests', () => {

  // ===========================
  // USERS
  // ===========================
  describe('USER API', () => {
    test('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Admin', email: 'admin@cs.com', password: 'pass123' })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    test('should login user', async () => {
      const user = new User({ name: 'Manager', email: 'manager@cs.com', password: 'pass123' });
      await user.save();

      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'manager@cs.com', password: 'pass123' })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('manager@cs.com');
    });
  });

  // ===========================
  // EQUIPMENT
  // ===========================
  describe('EQUIPMENT API', () => {
    let token, plant;

    beforeEach(async () => {
      const user = new User({ name: 'Engineer', email: 'eng@cs.com', password: 'pass123' });
      await user.save();
      token = await user.generateAuthToken();

      plant = await Plant.create({ name: 'Plant X', location: 'Dubai', emissions: 150 });
    });

    test('should add equipment to a plant', async () => {
      const response = await request(app)
        .post('/api/equipment')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Sensor-1', type: 'IoT Sensor', plantId: plant._id })  // ✅ FIX
        .expect(201);

      expect(response.body.name).toBe('Sensor-1');
      expect(response.body).toHaveProperty('plantId');
    });
  });

  // ===========================
  // REPORTS
  // ===========================
  describe('REPORT API', () => {
    let token;

    beforeEach(async () => {
      const user = new User({ name: 'Analyst', email: 'analyst@cs.com', password: 'pass123' });
      await user.save();
      token = await user.generateAuthToken();
    });

    test('should generate a sustainability report', async () => {
      const response = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Carbon Report 2025', summary: 'Emissions reduced by 15%' })
        .expect(201);

      expect(response.body.title).toBe('Carbon Report 2025');
    });
  });
});
