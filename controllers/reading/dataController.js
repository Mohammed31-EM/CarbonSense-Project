const Reading = require('../../models/reading');

const dataController = {};

/**
 * ✅ INDEX: Get all readings (optionally filtered by plant or equipment)
 */
dataController.index = async (req, res) => {
  try {
    const filter = {};
    if (req.query.plantId) filter.plantId = req.query.plantId;
    if (req.query.equipmentId) filter.equipmentId = req.query.equipmentId;

    const readings = await Reading.find(filter)
      .populate('plantId', 'name location')
      .populate('equipmentId', 'name type');

    return res.status(200).json(readings || []);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ SHOW: Get a single reading by ID
 */
dataController.show = async (req, res) => {
  try {
    const reading = await Reading.findById(req.params.id)
      .populate('plantId', 'name location')
      .populate('equipmentId', 'name type');

    if (!reading) return res.status(404).json({ message: 'Reading not found' });

    return res.status(200).json(reading);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ CREATE: Add a new reading
 */
dataController.create = async (req, res) => {
  try {
    // Basic validation
    if (!req.body.equipmentId || !req.body.parameter || !req.body.value) {
      return res.status(400).json({ message: 'equipmentId, parameter, and value are required' });
    }

    // Auto-assign status based on value (optional threshold logic)
    let status = 'Normal';
    if (req.body.parameter === 'emissions' && req.body.value > 100) status = 'Warning';
    if (req.body.parameter === 'emissions' && req.body.value > 500) status = 'Critical';

    const newReading = await Reading.create({
      plantId: req.body.plantId || null,
      equipmentId: req.body.equipmentId,
      parameter: req.body.parameter,
      value: req.body.value,
      status: req.body.status || status
    });

    return res.status(201).json(newReading);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ UPDATE: Edit an existing reading
 */
dataController.update = async (req, res) => {
  try {
    const updatedReading = await Reading.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('plantId', 'name location')
      .populate('equipmentId', 'name type');

    if (!updatedReading) {
      return res.status(404).json({ message: 'Reading not found' });
    }

    return res.status(200).json(updatedReading);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ DELETE: Remove a reading
 */
dataController.destroy = async (req, res) => {
  try {
    const deletedReading = await Reading.findByIdAndDelete(req.params.id);

    if (!deletedReading) {
      return res.status(404).json({ message: 'Reading not found' });
    }

    return res.status(200).json({ message: 'Reading deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = dataController;
