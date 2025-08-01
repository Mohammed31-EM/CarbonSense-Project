const viewController = { 
  /**
   * ✅ INDEX: List all reports
   */
  index(req, res) {
    res.render('report/Index', { 
      ...res.locals.data,
      token: res.locals.data.token || req.query.token || ''
    });
  },

  /**
   * ✅ SHOW: Show single report
   */
  show(req, res) {
    res.render('report/Show', { 
      ...res.locals.data,
      token: res.locals.data.token || req.query.token || ''
    });
  },

  /**
   * ✅ EDIT: Show edit report form
   */
  edit(req, res) {
    res.render('report/Edit', { 
      ...res.locals.data,
      token: res.locals.data.token || req.query.token || ''
    });
  },

  /**
   * ✅ NEW: Show form to create a new report
   */
  newView(req, res) {
    res.render('report/New', { 
      ...res.locals.data,
      token: res.locals.data.token || req.query.token || ''
    });
  },

  /**
   * ✅ Redirect to main reports page
   */
  redirectHome(req, res) {
    if (res.locals.data.token) {
      res.redirect(`/reports?token=${res.locals.data.token}`);
    } else {
      res.redirect('/reports');
    }
  },

  /**
   * ✅ Redirect to a specific report details page
   */
  redirectShow(req, res) {
    if (res.locals.data.token) {
      res.redirect(`/reports/${req.params.id}?token=${res.locals.data.token}`);
    } else {
      res.redirect(`/reports/${req.params.id}`);
    }
  }
};

module.exports = viewController;
