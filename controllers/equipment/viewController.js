const RESOURCE_PATH = '/equipment';

const viewController = {
  // ✅ INDEX
  index(req, res, next) {
    res.render('equipment/Index', {
      equipments: res.locals.data.equipments || [],
      token: res.locals.data.token || ''
    });
  },

  // ✅ SHOW
  show(req, res, next) {
    res.render('equipment/Show', {
      equipment: res.locals.data.equipment,
      token: res.locals.data.token || ''
    });
  },

  // ✅ EDIT
  edit(req, res, next) {
    res.render('equipment/Edit', {
      equipment: res.locals.data.equipment,
      token: res.locals.data.token || ''
    });
  },

  // ✅ NEW
  newView(req, res, next) {
    res.render('equipment/New', {
      token: res.locals.data.token || ''
    });
  },

  // ✅ REDIRECT HOME (after create/delete)
  redirectHome(req, res, next) {
    if (res.locals.data.token) {
      res.redirect(`${RESOURCE_PATH}?token=${res.locals.data.token}`);
    } else {
      res.redirect(RESOURCE_PATH);
    }
  },

  // ✅ REDIRECT SHOW (after update)
  redirectShow(req, res, next) {
    if (res.locals.data.token) {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}?token=${res.locals.data.token}`);
    } else {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}`);
    }
  }
};

module.exports = viewController;
