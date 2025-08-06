const RESOURCE_PATH = '/plants';

const viewController = {
  index(req, res, next) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    res.render('plant/Index', { ...res.locals.data, token });
  },

  newView(req, res, next) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    res.render('plant/New', { ...res.locals.data, token });
  },

  edit(req, res, next) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    res.render('plant/Edit', { ...res.locals.data, token });
  },

  show(req, res, next) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    res.render('plant/Show', { ...res.locals.data, token });
  },

  redirectHome(req, res, next) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    if (token) {

      return res.redirect(`${RESOURCE_PATH}?token=${encodeURIComponent(token)}`);
    }
    return res.redirect(RESOURCE_PATH);
  },

  redirectShow(req, res, next) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    if (token) {
      return res.redirect(`${RESOURCE_PATH}/${req.params.id}?token=${encodeURIComponent(token)}`);
    }
    return res.redirect(`${RESOURCE_PATH}/${req.params.id}`);
  }
};

module.exports = viewController;
