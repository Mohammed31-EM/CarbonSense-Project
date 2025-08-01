const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const server = app.listen(8081, () => console.log('CarbonSense Testing on PORT 8081'));

const User = require('../models/user');
const Plant = require('../models/plant');
const Report = require('../models/report');

let mongoServer;
let token, plant;

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

describe('🌍 CarbonSense API Tests', () => {

  beforeEach(async () => {
    const user = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123'
    });
    await user.save();
    token = await user.generateAuthToken();

    plant = await Plant.create({
      name: 'Bahrain Plant',
      location: 'Manama',
      emissions: 100
    });
  });

  // ✅ REPORT API FIXED TEST
  describe('REPORT API', () => {
    test('should generate a sustainability report', async () => {
      const reportData = {
        plantId: plant._id.toString(),
        periodStart: '2025-01-01',
        periodEnd: '2025-12-31',
        metrics: {
          totalEmissions: 200,
          totalEnergy: 500,
          waterUsage: 100,
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
      expect(response.body.metrics.totalEmissions).toBe(200);
    });
  });
});
