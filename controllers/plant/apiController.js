const Plant = require('../../models/plant.js');

const apiController = {
  index(req, res) {
    res.json(res.locals.data.plants);
  },

  show(req, res) {
    res.json(res.locals.data.plant);
  },

  create(req, res) {
    res.status(201).json(res.locals.data.plant);
  },

  update(req, res) {
    res.json(res.locals.data.plant);
  },

  destroy(req, res) {
    res.status(200).json({ message: 'Plant successfully deleted' });
  }
};

module.exports = apiController;
