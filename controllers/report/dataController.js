const Report = require('../../models/report');

const dataController = {};

dataController.index = async (req, res, next) => {
  try {
    const reports = await Report.find().populate('plantId generatedBy');
    res.locals.data.reports = reports;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

dataController.show = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate('plantId generatedBy');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.locals.data.report = report;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

dataController.create = async (req, res, next) => {
  try {
    const newReport = await Report.create(req.body);
    res.locals.data.report = newReport;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

dataController.update = async (req, res, next) => {
  try {
    const updated = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Report not found' });
    res.locals.data.report = updated;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

dataController.destroy = async (req, res, next) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.locals.data.message = 'Report deleted successfully';
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = dataController;
