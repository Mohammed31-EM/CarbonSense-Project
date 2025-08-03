const Equipment = require('../../models/equipment');

const dataController = {};

// INDEX: Get all equipment
dataController.index = async (req, res, next) => {
  try {
    res.locals.data.equipments = await Equipment.find();
    res.locals.data.token = req.query.token || res.locals.data.token;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// SHOW: Get one equipment by ID
dataController.show = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) throw new Error(`No equipment found with id ${req.params.id}`);
    res.locals.data.equipment = equipment;
    res.locals.data.token = req.query.token || res.locals.data.token;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// CREATE: Add new equipment
dataController.create = async (req, res, next) => {
  try {
    res.locals.data.equipment = await Equipment.create(req.body);
    res.locals.data.token = req.query.token || res.locals.data.token;

    // --- MQTT Publish ---
    try {
      const { publishEquipment } = require('../../utility/mqttClient');
      publishEquipment(res.locals.data.equipment, 'created');
    } catch (err) {
      console.warn('MQTT publish failed:', err.message);
    }

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE: Edit equipment
dataController.update = async (req, res, next) => {
  try {
    const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.locals.data.equipment = updated;
    res.locals.data.token = req.query.token || res.locals.data.token;

    // --- MQTT Publish ---
    try {
      const { publishEquipment } = require('../../utility/mqttClient');
      publishEquipment(updated, 'updated');
    } catch (err) {
      console.warn('MQTT publish failed:', err.message);
    }

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DESTROY: Delete equipment
dataController.destroy = async (req, res, next) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    res.locals.data.token = req.query.token || res.locals.data.token;

    // --- MQTT Publish ---
    try {
      const { publishEquipment } = require('../../utility/mqttClient');
      publishEquipment(deleted, 'deleted');
    } catch (err) {
      console.warn('MQTT publish failed:', err.message);
    }

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = dataController;
