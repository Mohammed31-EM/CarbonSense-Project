const viewController = { 

  index(req, res) {
    res.render('reading/Index', { 
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  show(req, res) {
    res.render('reading/Show', { 
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  edit(req, res) {
    res.render('reading/Edit', { 
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  newView(req, res) {
    res.render('reading/New', { 
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  redirectHome(req, res) {
    const token = req.query.token || res.locals.data?.token || '';
    if (token) {
      res.redirect(`/readings?token=${encodeURIComponent(token)}`);
    } else {
      res.redirect('/readings');
    }
  },

  redirectShow(req, res) {
    const token = req.query.token || res.locals.data?.token || '';
    if (token) {
      res.redirect(`/readings/${req.params.id}?token=${encodeURIComponent(token)}`);
    } else {
      res.redirect(`/readings/${req.params.id}`);
    }
  }
};

module.exports = viewController;
