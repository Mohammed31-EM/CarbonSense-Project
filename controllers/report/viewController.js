/**
 * 📌 VIEW Controller for Reports
 * Renders EJS/JSX views for reports
 */

const viewController = {
  /**
   * ✅ INDEX: List all reports
   */
  index(req, res) {
    res.render('report/Index', {
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  /**
   * ✅ SHOW: Show details for a single report
   */
  show(req, res) {
    res.render('report/Show', {
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  /**
   * ✅ NEW: Form to create a new report
   */
  newView(req, res) {
    res.render('report/New', {
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  /**
   * ✅ EDIT: Form to edit an existing report
   */
  edit(req, res) {
    res.render('report/Edit', {
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  /**
   * ✅ Redirect to main reports page
   */
  redirectHome(req, res) {
    if (res.locals.data?.token) {
      res.redirect(`/reports?token=${res.locals.data.token}`);
    } else {
      res.redirect('/reports');
    }
  },

  /**
   * ✅ Redirect to a specific report details page
   */
  redirectShow(req, res) {
    if (res.locals.data?.token) {
      res.redirect(`/reports/${req.params.id}?token=${res.locals.data.token}`);
    } else {
      res.redirect(`/reports/${req.params.id}`);
    }
  }
};

module.exports = viewController;
