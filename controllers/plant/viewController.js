const viewController = {
  index(req, res, next) {
    res.render('plant/Index', res.locals.data);
  },
  show(req, res, next) {
    res.render('plant/Show', res.locals.data);
  },
  edit(req, res, next) {
    res.render('plant/Edit', res.locals.data);
  },
  newView(req, res, next) {
    res.render('plant/New', res.locals.data);
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
