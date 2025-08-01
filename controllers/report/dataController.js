const Report = require('../../models/report');

const dataController = {};

/**
 * ✅ INDEX: Get all reports
 */
dataController.index = async (req, res) => {
  try {
    const reports = await Report.find().populate('generatedBy plantId');
    return res.status(200).json(reports || []);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ SHOW: Get a single report by ID
 */
dataController.show = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('generatedBy plantId');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    return res.status(200).json(report);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ CREATE: Add a new report
 */
dataController.create = async (req, res) => {
  try {
    if (!req.body.plantId || !req.body.periodStart || !req.body.periodEnd) {
      return res.status(400).json({ message: 'plantId, periodStart, and periodEnd are required' });
    }

    const newReport = await Report.create({
      ...req.body,
      generatedBy: req.user ? req.user._id : null
    });

    return res.status(201).json(newReport);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ UPDATE: Edit a report
 */
dataController.update = async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('generatedBy plantId');

    if (!updatedReport) return res.status(404).json({ message: 'Report not found' });
    return res.status(200).json(updatedReport);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ DELETE: Remove a report
 */
dataController.destroy = async (req, res) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ message: 'Report not found' });
    return res.status(200).json({ message: 'Report successfully deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = dataController;
