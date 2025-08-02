const RESOURCE_PATH = '/plants';

const viewController = {
  // ✅ Render index view
  index(req, res, next) {
    // Try to get token from query or from res.locals.data (set by auth)
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    res.render('plant/Index', { ...res.locals.data, token });
  },

  // ✅ Render new plant form
  newView(req, res, next) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    res.render('plant/New', { ...res.locals.data, token });
  },

  // ✅ Render edit plant form
  edit(req, res, next) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    res.render('plant/Edit', { ...res.locals.data, token });
  },

  // ✅ Render single plant view
  show(req, res, next) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    res.render('plant/Show', { ...res.locals.data, token });
  },

  // ✅ Redirect to home/index of plants with token
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

  // ✅ Redirect to show view of a single plant
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
