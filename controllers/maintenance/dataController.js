const Maintenance = require('../../models/maintenance');

// INDEX: Get all maintenance records
exports.index = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.find().populate('equipment plant');
    res.locals.data.maintenance = maintenance;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// SHOW: Get single maintenance record
exports.show = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id).populate('equipment plant');
    if (!maintenance) return res.status(404).json({ message: 'Maintenance record not found' });
    res.locals.data.maintenance = maintenance;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// CREATE: Add new maintenance record
exports.create = async (req, res, next) => {
  try {
    const newMaintenance = await Maintenance.create(req.body);
    res.locals.data.maintenance = newMaintenance;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE: Edit maintenance record
exports.update = async (req, res, next) => {
  try {
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMaintenance) return res.status(404).json({ message: 'Maintenance record not found' });
    res.locals.data.maintenance = updatedMaintenance;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DESTROY: Delete maintenance record
exports.destroy = async (req, res, next) => {
  try {
    const deleted = await Maintenance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Maintenance record not found' });
    res.locals.data.message = 'Maintenance record deleted successfully';
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
