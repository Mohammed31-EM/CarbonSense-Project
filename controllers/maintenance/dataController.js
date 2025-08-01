const Maintenance = require('../../models/maintenance');

const dataController = {};

// INDEX: Get all maintenance records
dataController.index = async (req, res) => {
  try {
    const logs = await Maintenance.find()
      .populate('equipmentId')
      .populate('plantId'); // Only works if plantId exists in schema

    return res.status(200).json(logs); // Always 200, even if empty
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// SHOW: Get single maintenance record
dataController.show = async (req, res) => {
  try {
    const log = await Maintenance.findById(req.params.id)
      .populate('equipmentId')
      .populate('plantId');

    if (!log) return res.status(400).json({ message: 'Maintenance log not found' });
    return res.status(200).json(log);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// CREATE: Add new maintenance record
dataController.create = async (req, res) => {
  try {
    if (!req.body.equipmentId /*|| !req.body.plantId*/) {
      return res.status(400).json({ message: 'equipmentId (and plantId if required) are required' });
    }

    const newLog = await Maintenance.create({
      equipmentId: req.body.equipmentId,
      performedBy: req.body.performedBy || null,
      tasksPerformed: req.body.tasksPerformed || [],
      notes: req.body.notes || '',
      nextScheduledDate: req.body.nextScheduledDate || null,
      status: req.body.status || 'Pending',
      plantId: req.body.plantId // Only if you add plantId in schema
    });

    return res.status(201).json(newLog);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// UPDATE
dataController.update = async (req, res) => {
  try {
    const updatedLog = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedLog) return res.status(404).json({ message: 'Maintenance log not found' });
    return res.status(200).json(updatedLog);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// DELETE
dataController.destroy = async (req, res) => {
  try {
    const deletedLog = await Maintenance.findByIdAndDelete(req.params.id);
    if (!deletedLog) return res.status(404).json({ message: 'Maintenance log not found' });
    return res.status(200).json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = dataController;
