const RESOURCE_PATH = '/maintenance';

const viewController = {
  index(req, res) {
    res.render('maintenance/Index', res.locals.data);
  },

  show(req, res) {
    res.render('maintenance/Show', res.locals.data);
  },

  newView(req, res) {
    res.render('maintenance/New', res.locals.data);
  },

  edit(req, res) {
    res.render('maintenance/Edit', res.locals.data);
  },

  redirectHome(req, res) {
    const token = res.locals.data.token ? `?token=${res.locals.data.token}` : '';
    res.redirect(`${RESOURCE_PATH}${token}`);
  },

  redirectShow(req, res) {
    const token = res.locals.data.token ? `?token=${res.locals.data.token}` : '';
    res.redirect(`${RESOURCE_PATH}/${req.params.id}${token}`);
  }
};

module.exports = viewController;
