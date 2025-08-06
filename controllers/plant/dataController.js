const Plant = require('../../models/plant.js');

const dataController = {};

dataController.index = async (req, res, next) => {
  try {
    res.locals.data.plants = await Plant.find({ user: req.user._id });
    res.locals.data.token = req.query.token || res.locals.data.token;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

dataController.destroy = async (req, res, next) => {
  try {
    const deleted = await Plant.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

dataController.update = async (req, res, next) => {
  try {
    const { name, location, emissions, status } = req.body;
    res.locals.data.plant = await Plant.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, location, emissions, status },
      { new: true, runValidators: true }
    );
    if (!res.locals.data.plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

dataController.create = async (req, res, next) => {
  try {
    const { name, location, emissions, status } = req.body;
    res.locals.data.plant = await Plant.create({
      name,
      location,
      emissions,
      status: status || 'Active',
      user: req.user._id
    });
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

dataController.show = async (req, res, next) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!plant) {
      return res.status(400).json({ message: `No plant found with id ${req.params.id}` });
    }
    res.locals.data.plant = plant;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid plant ID or request' });
  }
};

module.exports = dataController;
