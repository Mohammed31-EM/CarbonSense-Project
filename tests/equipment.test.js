const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const server = app.listen(8085, () => console.log('Testing Equipment on PORT 8085'));

const User = require('../models/user');
const Plant = require('../models/plant');
const Equipment = require('../models/equipment');

let mongoServer;
let token;
let plant;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
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

  // ✅ Create user and login to get token
  const user = new User({
    name: 'Admin User',
    email: 'admin@cs.com',
    password: 'password123',
  });
  await user.save();
  token = await user.generateAuthToken();

  // ✅ Create a plant to attach equipment
  plant = await Plant.create({
    name: 'Plant A',
    location: 'Bahrain',
    emissions: 120,
    status: 'Active',
  });
});

describe('Equipment API Tests', () => {
  test('should create equipment successfully', async () => {
    const response = await request(app)
      .post('/api/equipment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Compressor-1',
        type: 'Compressor',
        plantId: plant._id,
      })
      .expect(201);

    expect(response.body).toHaveProperty('name', 'Compressor-1');
    expect(response.body).toHaveProperty('type', 'Compressor');
    expect(response.body).toHaveProperty('plantId', String(plant._id));
  });

  test('should return all equipment for authenticated user', async () => {
    await Equipment.create({ name: 'Pump-1', type: 'Pump', plantId: plant._id });
    await Equipment.create({ name: 'Sensor-1', type: 'IoT Sensor', plantId: plant._id });

    const response = await request(app)
      .get('/api/equipment')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  test('should get single equipment by id', async () => {
    const equipment = await Equipment.create({
      name: 'Valve-1',
      type: 'Valve',
      plantId: plant._id,
    });

    const response = await request(app)
      .get(`/api/equipment/${equipment._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('name', 'Valve-1');
    expect(response.body).toHaveProperty('type', 'Valve');
    expect(response.body).toHaveProperty('plantId', String(plant._id));
  });

  test('should update equipment successfully', async () => {
    const equipment = await Equipment.create({
      name: 'Boiler-1',
      type: 'Boiler',
      plantId: plant._id,
    });

    const updateData = { name: 'Boiler-Updated', type: 'Boiler', plantId: plant._id };

    const response = await request(app)
      .put(`/api/equipment/${equipment._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('name', 'Boiler-Updated');
    expect(response.body).toHaveProperty('type', 'Boiler');
  });

  test('should delete equipment successfully', async () => {
    const equipment = await Equipment.create({
      name: 'Fan-1',
      type: 'Fan',
      plantId: plant._id,
    });

    const response = await request(app)
      .delete(`/api/equipment/${equipment._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Equipment deleted successfully');

    const deletedEquipment = await Equipment.findById(equipment._id);
    expect(deletedEquipment).toBeNull();
  });

  test('should return 401 without token', async () => {
    const response = await request(app)
      .get('/api/equipment')
      .expect(401);

    expect(response.text).toBe('Not authorized');
  });
});
