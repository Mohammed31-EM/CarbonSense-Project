const viewController = { 
  /**
   * ✅ INDEX: List all readings
   */
  index(req, res) {
    res.render('reading/Index', { 
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  /**
   * ✅ SHOW: Show single reading
   */
  show(req, res) {
    res.render('reading/Show', { 
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  /**
   * ✅ EDIT: Show edit reading form
   */
  edit(req, res) {
    res.render('reading/Edit', { 
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  /**
   * ✅ NEW: Show form to create a new reading
   */
  newView(req, res) {
    res.render('reading/New', { 
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  /**
   * ✅ Redirect to main readings page
   */
  redirectHome(req, res) {
    const token = res.locals.data?.token || req.query.token || '';
    res.redirect(`/readings?token=${token}`);
  },

  /**
   * ✅ Redirect to a specific reading details page
   */
  redirectShow(req, res) {
    const token = res.locals.data?.token || req.query.token || '';
    res.redirect(`/readings/${req.params.id}?token=${token}`);
  }
};

module.exports = viewController;
