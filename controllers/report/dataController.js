const Report = require('../../models/report');
const { generateReport } = require('../../utility/reportGenerator');

/**
 * ===========================
 * 📌 REPORT DATA CONTROLLER
 * ===========================
 */
const dataController = {};

/**
 * ✅ INDEX - Get all reports
 */
dataController.index = async (req, res, next) => {
  try {
    const reports = await Report.find().populate('plantId generatedBy');
    res.locals.data = reports;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ SHOW - Get a single report by ID
 */
dataController.show = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate('plantId generatedBy');
    if (!report) return res.status(404).json({ message: 'Report not found' });

    res.locals.data = report;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ CREATE - Auto-generate report based on plant readings
 */
dataController.create = async (req, res, next) => {
  try {
    const { plantId, periodStart, periodEnd } = req.body;

    if (!plantId || !periodStart || !periodEnd) {
      return res.status(400).json({ message: 'plantId, periodStart, and periodEnd are required' });
    }

    // 1️⃣ Generate report using the utility
    const generatedData = await generateReport(plantId, periodStart, periodEnd);

    // 2️⃣ Save report in DB
    const report = new Report({
      plantId,
      generatedBy: req.user._id,
      periodStart,
      periodEnd,
      metrics: generatedData.metrics,
      filePath: generatedData.filePath
    });

    await report.save();

    res.locals.data = report;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ UPDATE - Modify an existing report
 */
dataController.update = async (req, res, next) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) return res.status(404).json({ message: 'Report not found' });

    res.locals.data = updatedReport;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * ✅ DELETE - Remove a report
 */
dataController.destroy = async (req, res, next) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ message: 'Report not found' });

    res.locals.data = { message: 'Report successfully deleted' };
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = dataController;
