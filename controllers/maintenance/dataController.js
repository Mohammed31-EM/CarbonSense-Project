const Maintenance = require('../../models/maintenance');

const dataController = {};

// INDEX: Get all maintenance records
dataController.index = async (req, res, next) => {
  try {
    const logs = await Maintenance.find()
      .populate('equipmentId')
      .populate('plantId'); // Only works if plantId exists in schema
      res.locals.data = {maintenances: logs}
  if (req.originalUrl.includes('/api')) {
    return res.status(200).json(logs); 
  }
    return next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// SHOW: Get single maintenance record
dataController.show = async (req, res, next) => {
  try {
    const log = await Maintenance.findById(req.params.id)
      .populate('equipmentId')
      .populate('plantId');

    if (!log) return res.status(400).json({ message: 'Maintenance log not found' });
    if (req.originalUrl.includes('/api')) {
      return res.status(200).json(log);
    }
    res.locals.data = { maintenance: log };
    return next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// CREATE: Add new maintenance record
dataController.create = async (req, res, next) => {
  try {
    if (!req.body.equipmentId || !req.body.plantId) {
      if (!req.headers.accept || !req.headers.accept.includes('application/json')) {
        return res.status(400).json({ message: 'equipmentId (and plantId if required) are required' });
      }
      return res.status(400).json({ message: 'equipmentId (and plantId if required) are required' });
    }

    const newLog = await Maintenance.create({
      title: req.body.title,
      description: req.body.description,
      equipmentId: req.body.equipmentId,
      performedBy: req.body.performedBy || null,
      tasksPerformed: req.body.tasksPerformed || [],
      notes: req.body.notes || '',
      nextScheduledDate: req.body.nextScheduledDate || null,
      status: req.body.status || 'Pending',
      plantId: req.body.plantId // Only if you add plantId in schema
    });

    if (!req.headers.accept || !req.headers.accept.includes('application/json')) {
      res.locals.data = {maintenance: newLog};
      return next();
    }
    return res.status(201).json(newLog);
  } catch (error) {
    if (!req.headers.accept || !req.headers.accept.includes('applicaiton/json')){
      res.locals.data = { error: error.message}
      return next();
    }
    return res.status(400).json({ message: error.message });
  }
};

// UPDATE
dataController.update = async (req, res, next) => {
  try {
    const updatedLog = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedLog) return res.status(404).json({ message: 'Maintenance log not found' });
    if (req.originalUrl.includes('/api')){
      return res.status(200).json(updatedLog);
    }
    res.locals.data ={ maintenance: updatedLog};
    return next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// DELETE
dataController.destroy = async (req, res, next) => {
  try {
    const deletedLog = await Maintenance.findByIdAndDelete(req.params.id);
    if (!deletedLog) return res.status(404).json({ message: 'Maintenance log not found' });
    if (req.originalUrl.includes('/api')){
       return res.status(200).json({ message: 'Maintenance record deleted successfully' });
    }
   res.locals.ata = {message: 'Maintenance record deleted successfully'};
   return next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = dataController;
