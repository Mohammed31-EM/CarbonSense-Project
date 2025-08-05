const Reading = require('../../models/reading');

const apiController = {};

apiController.index = async (req, res) => {
  try {
    const readings = await Reading.find()
      .populate('equipmentId', 'name type');
    return res.status(200).json(readings || []);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

apiController.show = async (req, res) => {
  try {
    const reading = await Reading.findById(req.params.id)
      .populate('equipmentId', 'name type');
    if (!reading) return res.status(404).json({ message: 'Reading not found' });
    return res.status(200).json(reading);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


apiController.create = async (req, res) => {
  try {
    if (!req.body.equipmentId || !req.body.parameter || req.body.value === undefined) {
      return res.status(400).json({ message: 'equipmentId, parameter, and value are required' });
    }
    const newReading = await Reading.create(req.body);
    return res.status(201).json(newReading);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

apiController.update = async (req, res) => {
  try {
    const updatedReading = await Reading.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReading) return res.status(404).json({ message: 'Reading not found' });
    return res.status(200).json(updatedReading);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


apiController.destroy = async (req, res) => {
  try {
    const deletedReading = await Reading.findByIdAndDelete(req.params.id);
    if (!deletedReading) return res.status(404).json({ message: 'Reading not found' });
    return res.status(200).json({ message: 'Reading deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = apiController;
