const Plant = require('../../models/plant.js');

const dataController = {};

// INDEX: List all plants
dataController.index = async (req, res, next) => {
  try {
    // If you want user-specific plants later, add { owner: req.user._id }
    res.locals.data.plants = await Plant.find();
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// DESTROY: Delete plant by ID
dataController.destroy = async (req, res, next) => {
  try {
    await Plant.findOneAndDelete({ _id: req.params.id });
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// UPDATE: Update a plant by ID
dataController.update = async (req, res, next) => {
  try {
    res.locals.data.plant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// CREATE: Add a new plant
dataController.create = async (req, res, next) => {
  try {
    res.locals.data.plant = await Plant.create(req.body);
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// SHOW: Show one plant by ID
dataController.show = async (req, res, next) => {
  try {
    res.locals.data.plant = await Plant.findById(req.params.id);
    if (!res.locals.data.plant) {
      throw new Error(`Could not locate a plant with the id ${req.params.id}`);
    }
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = dataController;
