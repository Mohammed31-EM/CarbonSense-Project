const RESOURCE_PATH = '/equipment';

const viewController = {
  index(req, res) {
    res.render('equipment/Index', {
      equipments: res.locals.data.equipments,
      token: res.locals.data.token || ''
    });
  },
  show(req, res) {
    res.render('equipment/Show', {
      equipment: res.locals.data.equipment,
      token: res.locals.data.token || ''
    });
  },
  edit(req, res) {
    res.render('equipment/Edit', {
      equipment: res.locals.data.equipment,
      token: res.locals.data.token || ''
    });
  },
  newView(req, res) {
    res.render('equipment/New', {
      token: res.locals.data.token || ''
    });
  },
  redirectHome(req, res) {
    if (res.locals.data.token) {
      res.redirect(`${RESOURCE_PATH}?token=${res.locals.data.token}`);
    } else {
      res.redirect(RESOURCE_PATH);
    }
  },
  redirectShow(req, res) {
    if (res.locals.data.token) {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}?token=${res.locals.data.token}`);
    } else {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}`);
    }
  }
};

module.exports = viewController;
