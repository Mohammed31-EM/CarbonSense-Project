const Plant = require('../../models/plant.js');

const dataController = {};

// INDEX: List all plants
dataController.index = async (req, res, next) => {
  try {
    // Optionally, you can later add { owner: req.user._id } to filter user-specific plants
    res.locals.data.plants = await Plant.find();
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DESTROY: Delete plant by ID
dataController.destroy = async (req, res, next) => {
  try {
    const deleted = await Plant.findOneAndDelete({ _id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE: Update a plant by ID
dataController.update = async (req, res, next) => {
  try {
    const { name, location, emissions, status } = req.body;

    res.locals.data.plant = await Plant.findByIdAndUpdate(
      req.params.id,
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

// CREATE: Add a new plant
dataController.create = async (req, res, next) => {
  try {
    const { name, location, emissions, status } = req.body;

    // Default status if not provided
    res.locals.data.plant = await Plant.create({
      name,
      location,
      emissions,
      status: status || 'Active'
    });

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// SHOW: Show one plant by ID
dataController.show = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);
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

