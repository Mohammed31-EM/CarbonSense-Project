const Plant = require('../../models/plant.js');

// API Plant controllers - returns JSON responses
const apiController = {
  // INDEX: Get all plants as JSON
  index(req, res) {
    res.json(res.locals.data.plants);
  },

  // SHOW: Get single plant as JSON
  show(req, res) {
    res.json(res.locals.data.plant);
  },

  // CREATE: Return the newly created plant
  create(req, res) {
    res.status(201).json(res.locals.data.plant);
  },

  // UPDATE: Return the updated plant
  update(req, res) {
    res.json(res.locals.data.plant);
  },

  // DESTROY: Confirm deletion
  destroy(req, res) {
    res.status(200).json({ message: 'Plant successfully deleted' });
  }
};

module.exports = apiController;
