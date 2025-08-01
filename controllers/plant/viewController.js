const viewController = {
  index(req, res, next) {
    res.render('plant/Index', { 
      ...res.locals.data, 
      token: res.locals.data.token || req.query.token || ''
    });
  },
  show(req, res, next) {
    res.render('plant/Show', { 
      ...res.locals.data, 
      token: res.locals.data.token || req.query.token || ''
    });
  },
  edit(req, res, next) {
    res.render('plant/Edit', { 
      ...res.locals.data, 
      token: res.locals.data.token || req.query.token || ''
    });
  },
  newView(req, res, next) {
    res.render('plant/New', { 
      ...res.locals.data, 
      token: res.locals.data.token || req.query.token || ''
    });
  },
  redirectHome(req, res, next) {
    if (res.locals.data.token) {
      res.redirect(`/plants?token=${res.locals.data.token}`);
    } else {
      res.redirect('/plants');
    }
  },
  redirectShow(req, res, next) {
    if (res.locals.data.token) {
      res.redirect(`/plants/${req.params.id}?token=${res.locals.data.token}`);
    } else {
      res.redirect(`/plants/${req.params.id}`);
    }
  }
};

module.exports = viewController;
