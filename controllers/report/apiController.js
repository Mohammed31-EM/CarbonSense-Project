/**
 * 📌 API Controller for Reports
 * Handles sending JSON responses after data operations
 */

const apiController = {
  /**
   * ✅ INDEX - Return all reports
   */
  index(req, res) {
    res.status(200).json(res.locals.data.reports || []);
  },

  /**
   * ✅ SHOW - Return single report
   */
  show(req, res) {
    if (!res.locals.data.report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(res.locals.data.report);
  },

  /**
   * ✅ DESTROY - Return success message after deletion
   */
  destroy(req, res) {
    res.status(200).json({ message: 'Report deleted successfully' });
  }
};

module.exports = apiController;
